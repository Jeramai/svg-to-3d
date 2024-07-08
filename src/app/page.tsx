'use client';

import { OrbitControls, Stage } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Color, DoubleSide, ExtrudeGeometry, Group, Material, Matrix4, Mesh, MeshPhysicalMaterial, Object3D } from 'three';
import { SVGLoader, SVGResultPaths } from 'three/addons/loaders/SVGLoader.js';

export default function Home() {
  const loader = new SVGLoader();
  const [svg, setSVG] = useState<any>();
  const [model, setModel] = useState<Object3D>();

  // Turn SVG into model
  useEffect(() => {
    if (svg) {
      loader.load(svg, function (data) {
        const paths = data.paths;
        const group = new Group();

        paths.forEach((element, i) => {
          const material = getMaterial(element, data.xml);
          const shapes = SVGLoader.createShapes(element);
          for (const element of shapes) {
            const shape = element;
            const geometry = new ExtrudeGeometry(shape, {
              depth: 10,
              bevelEnabled: true,
              bevelThickness: 0.01,
              bevelSize: 0.1,
              bevelSegments: 8,
              curveSegments: 30
            });
            // TODO: Custom layer order
            geometry.applyMatrix4(new Matrix4().makeScale(1, -1, 1 - i * 0.001));

            const mesh = new Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            group.add(mesh);
          }

          setModel(group);
        });
      });
    }
  }, [svg]);

  if (!model) return <SvgInput setSVG={setSVG} />;
  return (
    <Canvas shadows>
      <Stage shadows>
        <primitive object={model} />
      </Stage>
      <OrbitControls />
    </Canvas>
  );
}
function SvgInput({ setSVG }: Readonly<{ setSVG: any }>) {
  const onFileChange = (e: any) => {
    if (!e.target.files[0]) return setSVG();
    setSVG(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div>
      <input type='file' onChange={onFileChange} accept='.svg' />
    </div>
  );
}

function getMaterial(path: SVGResultPaths, xml: XMLDocument): Material {
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
  return new MeshPhysicalMaterial({ color, side: DoubleSide, transparent: true, opacity });
}
