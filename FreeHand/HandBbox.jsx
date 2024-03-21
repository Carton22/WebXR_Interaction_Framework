import { useXR } from "@react-three/xr";
import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { globals } from "./ARApp";
import { Box3 } from "three";

export const HandBbox = () => {
	const { controllers } = useXR();
	const { scene } = useThree();
	const rightTipRef = useRef();
	const leftTipRef = useRef();
	const rightMiddleTipRef = useRef();
	let leftTipBB = useState();
	let rightTipBB = useState();
	let rightMiddleTipBB = useState();
	let bboxBB = useState();
	let [lastIntersect, setLastIntersect] = useState(false);
	let [lastMiddleIntersect, setLastMiddleIntersect] = useState(false);

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
			}
			// console.log("scene", scene);
			let rightTipBbox = scene.getObjectByName("rightTipBbox");
			// console.log("rightTipBbox", rightTipBbox);
			let leftTipBbox = scene.getObjectByName("leftTipBbox");
			// console.log("leftTipBbox", leftTipBbox);
			let bbox = scene.getObjectByName("bbox");

			let rightMiddleTipBbox = scene.getObjectByName("rightMiddleTipBbox")
			leftTipBB = new Box3().setFromObject(leftTipBbox);

			rightTipBB = new Box3().setFromObject(rightTipBbox);

			rightMiddleTipBB = new Box3().setFromObject(rightMiddleTipBbox);

			bboxBB = new Box3().setFromObject(bbox);

			if (
				leftTipBB.intersectsBox(rightTipBB) &&
				leftTipBB.max.x !== -rightTipBB.min.x
			) {
				if (lastIntersect === false) {
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

			if (
				leftTipBB.intersectsBox(rightMiddleTipBB)
			) {
				if (lastMiddleIntersect === false) {
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

			if (
				(leftTipBB.intersectsBox(bboxBB) || rightTipBB.intersectsBox(bboxBB)) &&
				globals.moveMode !== "freecontrol" &&
				globals.moveMode !== "bindhand"
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
				<boxGeometry args={[0.02, 0.02, 0.02]} />
				<meshStandardMaterial color={"green"} transparent opacity={1} />
			</mesh>
			<mesh name="rightTipBbox" ref={rightTipRef}>
				<boxGeometry args={[0.02, 0.02, 0.02]} />
				<meshStandardMaterial color={"orange"} transparent opacity={1} />
			</mesh>
			<mesh name="rightMiddleTipBbox" ref={rightMiddleTipRef}>
				<boxGeometry args={[0.02, 0.02, 0.02]} />
				<meshStandardMaterial color={"red"} transparent opacity={1} />
			</mesh>
		</>
	);
};
