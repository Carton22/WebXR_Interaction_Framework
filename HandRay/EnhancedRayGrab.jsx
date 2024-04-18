import { useRef, useMemo } from "react";
import { Object3D, Matrix4, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Interactive, useXR } from "@react-three/xr";
import { globals } from "./ARApp";
import { PositionalAudio, AudioLoader, AudioListener } from "three";

export function EnhancedRayGrab({
	setPlayM,
	setPlayE,
	children,
	...rest
}) {
	const controller1Ref = useRef();
	const controller2Ref = useRef();
	// both hands are still operating (pinching/intersecting with the object)
	let bothHands = useRef(false);

	const initialDistance = useRef(0);
	const previousTransform = useMemo(() => new Matrix4(), []);
	const {camera} = useXR();

	useFrame(() => {
		const controller1 = controller1Ref.current;
		const controller2 = controller2Ref.current;
		// console.log("mode", globals.moveMode);
		const obj = intersectedObj.current;
		// console.log("gg",obj);
		if (!obj) return;
		if (!controller1) return;

		if (globals.moveMode == "bbox") {
			if (controller1 && !controller2 && !bothHands.current) {
				// console.log("ccc", controller1.matrixWorld);
				// Handle translation and rotation for single controller
				obj.applyMatrix4(previousTransform);
				obj.applyMatrix4(controller1.matrixWorld);
				obj.updateMatrixWorld();
				previousTransform.copy(controller1.matrixWorld).invert();

				// let quaternion = new Quaternion().setFromRotationMatrix(
				// 	previousTransform.multiply(controller1.matrixWorld)
				// );
			} else if (controller1 && controller2) {
				// Handle scaling for two controllers
				bothHands.current = true;
				const currentDistance = controller1.position.distanceTo(
					controller2.position
				);
				if (initialDistance.current === 0) {
					initialDistance.current = currentDistance;
				}

				const scale = currentDistance / initialDistance.current;
				const initScale = initialScale.current;
				obj.scale.set(initScale.x, initScale.y, initScale.z);
				obj.scale.multiplyScalar(scale);
			}
		}
	});

	const intersectedObj = useRef();
	const initialScale = useRef();
	const handleSelectStart = (e) => {
		setPlayM(true);
		// only play the sound for once
		setTimeout(() => {
			setPlayM(false);
		}, 150);
		intersectedObj.current = e.intersection?.object;
		console.log("kkk intersectedObj", intersectedObj.current);
		console.log(
			"intersectedObj",
			intersectedObj.current.parent,
			intersectedObj.current.name
		);

		console.log("not child");
		globals.handIndex = e.target.index;
		console.log("hard", intersectedObj.current.name);
		if (intersectedObj.current.name === "bbox") {
			globals.moveMode = "bbox";
		}
		console.log("handleSelectStart");
		if (
			globals.moveMode == "bbox" ||
			"insideHoldingPoint" ||
			"holdingRotateHandler"
		) {
			const controller = e.target;
			// Determine if it's the first or second controller
			if (controller1Ref.current === undefined) {
				controller1Ref.current = controller.controller;
				previousTransform.copy(controller.controller.matrixWorld).invert();
				// initialScale.current = intersectedObj.current?.scale.clone();
			} else if (
				controller2Ref.current === undefined &&
				controller1Ref.current !== controller.controller
			) {
				controller2Ref.current = controller.controller;
				// initialDistance.current = 0;
			}
			if (globals.moveMode == "bbox") {
				initialScale.current = intersectedObj.current?.scale.clone();
				if (controller1Ref.current && controller2Ref.current) {
					initialDistance.current = controller1Ref.current.position.distanceTo(
						controller2Ref.current.position
					);
				}
			} else if (globals.moveMode == "insideHoldingPoint") {
				initialScale.current =
					intersectedObj.current?.parent.parent.scale.clone();
				initialDistance.current = controller.controller.position.distanceTo(
					intersectedObj.current.parent.parent.position
				);
			} else if (globals.moveMode == "holdingRotateHandler") {
				previousControllerPos.copy(controller.controller.position);
			}
		}
	};

	const handleSelectEnd = (e) => {
		setPlayE(true);
		// only play the sound for once
		setTimeout(() => {
			setPlayE(false);
		}, 500);
		if (
			globals.moveMode == "bbox" ||
			"insideHoldingPoint" ||
			"holdingRotateHandler"
		) {
			const controller = e.target;
			console.log("handleSelectEnd", controller.controller);
			if (controller1Ref.current === controller.controller) {
				controller1Ref.current = undefined;
				bothHands.current = false;
				if (controller2Ref.current) {
					previousTransform.copy(controller2Ref.current.matrixWorld).invert();
					//TODO: need to set globals.handIndex here;
					controller1Ref.current = controller2Ref.current;
					controller2Ref.current = undefined;
				}
			} else if (controller2Ref.current === controller.controller) {
				controller2Ref.current = undefined;
				bothHands.current = false;
				if (controller1Ref.current) {
					previousTransform.copy(controller1Ref.current.matrixWorld).invert();
					//TODO: need to set globals.handIndex here;
				}
			}
			if (!controller1Ref.current && !controller2Ref.current) {
				intersectedObj.current = undefined;
				initialScale.current = undefined;
				initialDistance.current = 0;
				if (globals.moveMode !== "measuring") {
					globals.moveMode = "off";
				}
				console.log("here off 7");
				globals.handIndex = -1;
			}
		}
	};

	const ReleaseSelectEndHandler = () => {
		const { controllers } = useXR();

		useFrame(() => {
			if (controllers && controllers[0] && controllers[1]) {
				if (
					globals.moveMode == "holdingRotateHandler" ||
					globals.moveMode == "insideHoldingPoint" ||
					globals.moveMode == "insideBbox" ||
					globals.moveMode == "bbox"
				) {
					if (controllers[0].hand) {
						// console.log("free release", globals.handIndex);
						if (
							controllers[0].hand.inputState.pinching == false &&
							globals.handIndex == 0
						) {
							console.log("handleSelectEnd", controllers[0]);
							if (controller1Ref.current === controllers[0].controller) {
								controller1Ref.current = undefined;
								bothHands.current = false;
								console.log("hooo");
								if (controller2Ref.current) {
									console.log("haaa");
									previousTransform
										.copy(controller2Ref.current.matrixWorld)
										.invert();
									globals.handIndex = 1;
									console.log("set 1 here 1");
									controller1Ref.current = controller2Ref.current;
									controller2Ref.current = undefined;
								}
							} else if (controller2Ref.current === controllers[0].controller) {
								controller2Ref.current = undefined;
								bothHands.current = false;
								if (controller1Ref.current) {
									previousTransform
										.copy(controller1Ref.current.matrixWorld)
										.invert();
									globals.handIndex = 1;
									console.log("set 1 here 2");
								}
							}
							if (!controller1Ref.current && !controller2Ref.current) {
								intersectedObj.current = undefined;
								initialScale.current = undefined;
								initialDistance.current = 0;
								if (globals.moveMode === "bbox") {
									globals.moveMode = "off";
								}
								globals.handIndex = -1;
								console.log("here off 8");
							}
						}
					}
					if (controllers[1].hand) {
						// console.log("free release 2", globals.handIndex);
						if (
							controllers[1].hand.inputState.pinching == false &&
							globals.handIndex == 1
						) {
							console.log("handleSelectEnd", controllers[1]);
							if (controller1Ref.current === controllers[1].controller) {
								controller1Ref.current = undefined;
								bothHands.current = false;
								console.log("hooo 11");
								if (controller2Ref.current) {
									console.log("haaa 11");
									previousTransform
										.copy(controller2Ref.current.matrixWorld)
										.invert();
									globals.handIndex = 0;
									controller1Ref.current = controller2Ref.current;
									controller2Ref.current = undefined;
								}
							} else if (controller2Ref.current === controllers[1].controller) {
								controller2Ref.current = undefined;
								bothHands.current = false;
								if (controller1Ref.current) {
									previousTransform
										.copy(controller1Ref.current.matrixWorld)
										.invert();
									globals.handIndex = 0;
								}
							}
							if (!controller1Ref.current && !controller2Ref.current) {
								intersectedObj.current = undefined;
								initialScale.current = undefined;
								initialDistance.current = 0;
								if (globals.moveMode === "bbox") {
									globals.moveMode = "off";
								}
								globals.handIndex = -1;
								console.log("here off 9");
							}
						}
					}
				}
			}
		});
	};

	return (
		<Interactive
			onSelectStart={handleSelectStart}
			onSelectEnd={handleSelectEnd}
			{...rest}
		>
			{children}
			<ReleaseSelectEndHandler />
		</Interactive>
	);
}
