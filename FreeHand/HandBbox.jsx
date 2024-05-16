import { useXR } from "@react-three/xr";
import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { globals } from "./ARApp";
import { Box3 } from "three";
import { PositionalAudio } from "@react-three/drei";

export const HandBbox = () => {
	const { controllers } = useXR();
	const { scene } = useThree();
	const rightTipRef = useRef();
	const leftTipRef = useRef();
	const rightMiddleTipRef = useRef();
	const leftPinkyTipRef = useRef();
	let leftTipBB = useState();
	let rightTipBB = useState();
	let rightMiddleTipBB = useState();
	let leftPinkyTipBB = useState();
	let bboxBB = useState();
	let [lastIntersect, setLastIntersect] = useState(false);
	let [lastMiddleIntersect, setLastMiddleIntersect] = useState(false);
	let [lastPinkyIntersect, setLastPinkyIntersect] = useState(false);

	let [PlayMFreeHand, setPlayMFreeHand] = useState(false);
	let [PlayMPress, setPlayMPress] = useState(false);

	useFrame(() => {
		if (controllers && controllers[0] && controllers[1]) {
			if (controllers[0].controller) {
				const rightTipPosition =
					controllers[0].hand.joints["index-finger-tip"].position;
				rightTipRef.current.position.copy(rightTipPosition);
				const rightMiddleTipPosition =
					controllers[0].hand.joints["pinky-finger-tip"].position;
				rightMiddleTipRef.current.position.copy(rightMiddleTipPosition);
			}
			if (controllers[1].controller) {
				const leftTipPosition =
					controllers[1].hand.joints["index-finger-tip"].position;
				leftTipRef.current.position.copy(leftTipPosition);
				const leftPinkyTipPosition =
					controllers[1].hand.joints["pinky-finger-tip"].position;
				leftPinkyTipRef.current.position.copy(leftPinkyTipPosition);
			}
			// console.log("scene", scene);
			let rightTipBbox = scene.getObjectByName("rightTipBbox");
			// console.log("rightTipBbox", rightTipBbox);
			let leftTipBbox = scene.getObjectByName("leftTipBbox");
			// console.log("leftTipBbox", leftTipBbox);
			let bbox = scene.getObjectByName("bbox");

			let rightMiddleTipBbox = scene.getObjectByName("rightMiddleTipBbox");
			let leftPinkyTipBbox = scene.getObjectByName("leftPinkyTipBbox");

			leftTipBB = new Box3().setFromObject(leftTipBbox);

			rightTipBB = new Box3().setFromObject(rightTipBbox);

			rightMiddleTipBB = new Box3().setFromObject(rightMiddleTipBbox);

			leftPinkyTipBB = new Box3().setFromObject(leftPinkyTipBbox);

			bboxBB = new Box3().setFromObject(bbox);

			if (
				leftTipBB.intersectsBox(rightTipBB) &&
				leftTipBB.max.x !== -rightTipBB.min.x
			) {
				if (lastIntersect === false) {
					setPlayMFreeHand(true);
					// only play the sound for once
					setTimeout(() => {
						setPlayMFreeHand(false);
					}, 500);
					setLastIntersect(true);
					if (globals.moveMode === "freecontrol") {
						globals.moveMode = "off";
						console.log("cancel mode freecontrol");
					} else {
						globals.moveMode = "freecontrol";
						console.log("set mode freecontrol");
					}
				}
			} else {
				setLastIntersect(false);
			}

			if (leftTipBB.intersectsBox(rightMiddleTipBB)) {
				if (lastMiddleIntersect === false) {
					setPlayMPress(true);
					// only play the sound for once
					setTimeout(() => {
						setPlayMPress(false);
					}, 300);
					setLastMiddleIntersect(true);
					if (globals.moveMode === "bindhand") {
						globals.moveMode = "off";
						console.log("cancel mode bindhand");
					} else {
						globals.moveMode = "bindhand";
						console.log("set mode bindhand");
					}
				}
			} else {
				setLastMiddleIntersect(false);
			}

			if (rightTipBB.intersectsBox(leftPinkyTipBB)) {
				if (lastPinkyIntersect === false) {
					setPlayMPress(true);
					// only play the sound for once
					setTimeout(() => {
						setPlayMPress(false);
					}, 300);
					setLastPinkyIntersect(true);
					if (globals.moveMode === "freemove") {
						globals.moveMode = "off";
						console.log("cancel mode freemove");
					} else {
						globals.moveMode = "freemove";
						console.log("set mode freemove");
					}
				}
			} else {
				setLastPinkyIntersect(false);
			}

			if (
				(leftTipBB.intersectsBox(bboxBB) || rightTipBB.intersectsBox(bboxBB)) &&
				globals.moveMode !== "freecontrol" &&
				globals.moveMode !== "bindhand" &&
				globals.moveMode !== "freemove"
			) {
				globals.moveMode = "insideBbox";
				console.log("xxx", globals.moveMode);
			}

			if (
				!(leftTipBB.intersectsBox(bboxBB) || rightTipBB.intersectsBox(bboxBB))
			) {
				if (globals.moveMode === "insideBbox") {
					globals.moveMode = "off";
					console.log("here off 3");
				}
			}
		}
	});

	return (
		<>
			<mesh name="leftTipBbox" ref={leftTipRef}>
				<sphereGeometry args={[0.01]} />
				<meshStandardMaterial color={"red"} transparent opacity={0.7} />
				{/* <group position={[0, 0, 0]}>
					{PlayMFreeHand && (
						<PositionalAudio url="../activate.MP3" autoplay distance={0.1} />
					)}
				</group>
				<group position={[0, 0, 0]}>
					{PlayMPress && (
						<PositionalAudio url="../press.MP3" autoplay distance={0.1} />
					)}
				</group> */}
			</mesh>
			<mesh name="rightTipBbox" ref={rightTipRef}>
				<sphereGeometry args={[0.01]} />
				<meshStandardMaterial color={"blue"} transparent opacity={0.7} />
			</mesh>
			<mesh name="rightMiddleTipBbox" ref={rightMiddleTipRef}>
				<sphereGeometry args={[0.01]} />
				<meshStandardMaterial color={"red"} transparent opacity={0.7} />
			</mesh>
			<mesh name="leftPinkyTipBbox" ref={leftPinkyTipRef}>
				<sphereGeometry args={[0.01]} />
				<meshStandardMaterial color={"blue"} transparent opacity={0.7} />
			</mesh>
		</>
	);
};
