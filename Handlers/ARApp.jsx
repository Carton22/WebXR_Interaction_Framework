import { Canvas, events, useFrame, useThree } from "@react-three/fiber";
import { XRButton, XR, Hands, useXR } from "@react-three/xr";
import { Controllers } from "./react-xr/Controller";
import { BackSide, DoubleSide, Vector3 } from "three";
import {
	OrbitControls,
	Sky,
	useGLTF,
	PositionalAudio,
	Edges,
} from "@react-three/drei";
import { React, useRef, useState, useEffect } from "react";
import { AxisPoints } from "./AxisPoints";
import { EnhancedRayGrab } from "./EnhancedRayGrab";
import { RotateHandlers } from "./RotateHandlers";
import { HoldingPoints } from "./HoldingPoints";

// export let realityMode = "AR";
export let realityMode = "VR";
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
	const boxLength = [1, 1, 1];
	const objScale = [1, 1, 1];
	const [playM, setPlayM] = useState(false);
	const [playE, setPlayE] = useState(false);
	const [PlayMScroll, setPlayMScroll] = useState(false);
	const [PlayMRotateHandler, setPlayMRotateHandler] = useState(false);
	const [PlayMHoldingPoint, setPlayMHoldingPoint] = useState(false);

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
					<EnhancedRayGrab
						setPlayM={setPlayM}
						setPlayE={setPlayE}
						setPlayMScroll={setPlayMScroll}
						setPlayMRotateHandler={setPlayMRotateHandler}
						setPlayMHoldingPoint={setPlayMHoldingPoint}
					>
						<mesh name="bbox" position={[0, 1.5, -2]} scale={objScale}>
							<Edges name="bboxEdges" color={"white"} />
							<boxGeometry args={boxLength} />
							<meshStandardMaterial color="skyblue" transparent opacity={1} />
							<AxisPoints objScale={objScale} boxLength={boxLength} />
							<RotateHandlers objScale={objScale} boxLength={boxLength} />
							<HoldingPoints objScale={objScale} boxLength={boxLength} />
							<group position={[0, 0, 0]}>
								{playM && (
									<PositionalAudio url="../grab.MP3" autoplay distance={0.1} />
								)}
							</group>
							<group position={[0, 0, 0]}>
								{playE && (
									<PositionalAudio url="../rel.MP3" autoplay distance={0.1} />
								)}
							</group>
							<group position={[0, 0, 0]}>
								{PlayMRotateHandler && (
									<PositionalAudio url="../press.MP3" autoplay distance={0.1} />
								)}
							</group>
							<group position={[0, 0, 0]}>
								{PlayMScroll && (
									<PositionalAudio url="../scroll.MP3" autoplay loop distance={0.1} />
								)}
							</group>
							<group position={[0, 0, 0]}>
								{PlayMHoldingPoint && (
									<PositionalAudio
										url="../activate.MP3"
										autoplay
										distance={0.1}
									/>
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
