'use client';

import { ISettings } from '@/types/ISettings';
import { OrbitControls, Stage } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import {
  Box3,
  Color,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  Material,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  Vector3
} from 'three';
import { SVGLoader, SVGResultPaths } from 'three/addons/loaders/SVGLoader.js';
import Buttons from './components/Buttons';
import Settings from './components/Settings';
import UploadField from './components/UploadField';

export default function Home() {
  const loader = new SVGLoader();
  const [svg, setSVG] = useState<any>();
  const [model, setModel] = useState<Object3D>();

  const [background, setBackground] = useState<string>('#000000');
  const [settings, setSettings] = useState<ISettings>({
    depth: 10
  });

  const restart = () => {
    setSVG(undefined);
    setModel(undefined);
  };

  // Turn SVG into model
  useEffect(() => {
    if (svg) {
      const depth = Number.isNaN(settings?.depth) ? 0 : settings?.depth;

      loader.load(svg, function (data) {
        const paths = data.paths;
        const group = new Group();
        group.name = 'Model';

        // Add svg paths to model group
        paths.forEach((element, i) => {
          const material = getMaterial(element, data.xml);
          const shapes = SVGLoader.createShapes(element);
          for (const element of shapes) {
            const shape = element;
            const geometry = new ExtrudeGeometry(shape, {
              depth,
              bevelEnabled: true,
              bevelThickness: 0.01,
              bevelSize: 0.1,
              bevelSegments: 8,
              curveSegments: 30
            });
            // TODO: Custom layer order
            geometry.applyMatrix4(new Matrix4().makeScale(1, -1, 1));

            const mesh = new Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.position.z = i * 0.005;

            group.add(mesh);
          }
        });

        // Create bounding box holder object
        const box = new Box3();

        // Scale group to be 1 meter in width
        box.setFromObject(group);
        const scale = 1 / (box.max.x - box.min.x);
        group.scale.set(scale, scale, scale);

        // Center the group
        box.setFromObject(group);
        const center = new Vector3();
        box.getCenter(center);
        group.position.sub(center);
        // group.position.sub({ ...center, y: box.max.y + box.min.y });

        setModel(group);
      });
    }
  }, [svg, settings]);

  if (!model) {
    return (
      <div className='w-full h-full flex flex-col'>
        <div className='flex justify-center content-center p-10 pb-2 text-3xl'>
          <h1>Upload your SVG file to generate your 3D logo!</h1>
        </div>
        <UploadField setSVG={setSVG} />
      </div>
    );
  }
  return (
    <>
      <Canvas shadows>
        <Stage shadows adjustCamera>
          <primitive object={model} />
        </Stage>

        <OrbitControls />
        <color attach='background' args={[background ?? 0x000000]} />
      </Canvas>

      <Buttons model={model} restart={restart} />
      <Settings settings={settings} setSettings={setSettings} background={background} setBackground={setBackground} />
    </>
  );
}

function getMaterial(path: SVGResultPaths, xml: XMLDocument, settings?: Object): Material {
  let color = path.color;

  // When "currentColor", default to black
  if (path?.userData?.style?.fill === 'currentColor') color = new Color(0x000000);
  // When starts with "url(", try and get from styles
  else if (path?.userData?.style?.fill?.startsWith('url(')) {
    const urlString = path.userData.style.fill;
    const gradientId = urlString.slice(5, -2); // Extract gradient ID

    const getColorByID = (id: any): Color => {
      // Get object in XML by ID
      const linearGradientObject = xml.querySelector(id);
      const stops = linearGradientObject.querySelectorAll('stop');

      // When stop-color's found
      if (stops.length) {
        // TODO: Use multiple colors
        const stopColor = stops?.[0]?.getAttribute('stop-color');
        return new Color(stopColor ?? 0xffffff);
      }
      // Else check for "xlink:href"
      else {
        const linkedId = linearGradientObject.getAttribute('xlink:href');
        return getColorByID(linkedId);
      }
    };
    color = getColorByID(gradientId);
  }

  const opacity = path?.userData?.style?.opacity ?? 1;
  const depthTest = opacity === 1;
  const transparent = opacity !== 1;
  return new MeshPhysicalMaterial({ color, side: DoubleSide, transparent, opacity, depthTest });
}
