import { Canvas, events, useFrame, useThree } from "@react-three/fiber";
import { XRButton, XR, Hands, Interactive, useXR } from "@react-three/xr";
import { Controllers } from "./react-xr/Controller";
import { BackSide, DoubleSide, Vector3 } from "three";
import {
	OrbitControls,
	Sky,
	useGLTF,
	PositionalAudio,
} from "@react-three/drei";
import { React, useRef, useState, useEffect } from "react";
import { AxisPoints } from "./AxisPoints";
import { EnhancedRayGrab } from "./EnhancedRayGrab";
import config from "./config.json";

export let realityMode = "AR";
// export let realityMode = "VR";
export let globals = { moveMode: "off", handIndex: -1 };

function HandDecorate() {
	const { controllers } = useXR();

	useFrame(() => {
		if (controllers && controllers[0] && controllers[1]) {
			if (controllers[0].hand) {
				if (controllers[0].hand.children[25]) {
					if (controllers[0].hand.children[25].children[0]) {
						if (controllers[0].hand.children[25].children[0].children[0]) {
							controllers[0].hand.children[25].children[0].children[0].material.transparent = true;
							controllers[0].hand.children[25].children[0].children[0].material.opacity = 0.5;
						}
					}
				}
			}
			if (controllers[1].hand) {
				if (controllers[1].hand.children[25]) {
					if (controllers[1].hand.children[25].children[0]) {
						if (controllers[1].hand.children[25].children[0].children[0]) {
							controllers[1].hand.children[25].children[0].children[0].material.transparent = true;
							controllers[1].hand.children[25].children[0].children[0].material.opacity = 0.5;
						}
					}
				}
			}
		}
	});
}

export default function App() {
	const [playM, setPlayM] = useState(false);
	const [playE, setPlayE] = useState(false);

	return (
		<div id="ThreeJs" style={{ width: "100%", height: "100%" }}>
			<XRButton
				mode={realityMode}
				sessionInit={{ optionalFeatures: ["hand-tracking"] }}
				style={{
					backgroundColor: "#007bff",
					color: "#fff",
					border: "none",
					padding: "15px 25px",
					borderRadius: "8px",
					cursor: "pointer",
					fontWeight: "bold",
					boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
					scale: "2",
					position: "absolute",
					bottom: "10%",
					left: "52%",
					transform: "translateX(-50%)",
					zIndex: 1,
				}}
			/>
			<Canvas camera={{ position: [0, 3, 2], rotation: [0, 0, 0] }}>
				<XR>
					{lights}
					<Controllers />
					<Hands />
					<EnhancedRayGrab setPlayM={setPlayM} setPlayE={setPlayE}>
						<mesh
							name="bbox"
							position={config.bboxPosition}
							scale={config.objScale}
							// onClick={(e) => {
							// 	// Example: Move the object to a new random position
							// 	console.log("on click", e.target.name);
							// 	const newConfig = { ...config, bboxPosition: e.target.position };
							// 	localStorage.setItem("config", JSON.stringify(newConfig));
							// }}
						>
							<boxGeometry args={config.boxLength} />
							<meshStandardMaterial color="skyblue" transparent opacity={1} />
							<AxisPoints
								objScale={config.objScale}
								boxLength={config.boxLength}
							/>
							<group position={[0, 0, 0]}>
								{playM && (
									<PositionalAudio url="../grab.MP3" autoplay distance={0.1} />
								)}
							</group>
							<group position={[0, 1.5, -2]}>
								{playE && (
									<PositionalAudio url="../rel.MP3" autoplay distance={0.1} />
								)}
							</group>
						</mesh>
					</EnhancedRayGrab>
					<HandDecorate />
					<OrbitControls />
					{realityMode == "VR" && (
						<Sky
							distance={450000}
							sunPosition={[0, 1, 0]}
							inclination={0}
							azimuth={0.25}
						/>
					)}
				</XR>
			</Canvas>
		</div>
	);
}

const lights = (
	<>
		<ambientLight intensity={2} />
		<directionalLight position={[0, 50, 160]} intensity={1.5} />
	</>
);
