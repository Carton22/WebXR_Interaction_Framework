import { useRef, useMemo, useState } from "react";
import { Object3D, Matrix4, Vector3, Quaternion } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Interactive, useXR } from "@react-three/xr";
import { globals } from "./ARApp";
import { Text, Center } from "@react-three/drei";

export function EnhancedRayGrab({
	onSelectStart,
	onSelectEnd,
	children,
	...rest
}) {
	const controller1Ref = useRef();
	const controller2Ref = useRef();
	let bothHands = useRef(false);
	const { scene } = useThree();

	const initialDistance = useRef(0);
	const previousTransform = useMemo(() => new Matrix4(), []);

	// for rotate handlers
	// rotate the object
	let deltaController = new Vector3();
	let previousControllerPos = new Vector3();
	let [t, setT] = useState("");

	useFrame(() => {
		const controller1 = controller1Ref.current;
		const controller2 = controller2Ref.current;
		setT(globals.moveMode);
		console.log("globals.moveMode", globals.moveMode);
		const obj = intersectedObj.current;
		if (!obj) return;
		if (!controller1) return;
		if (globals.moveMode == "bbox") {
			if (controller1 && !controller2) {
				// Handle translation and rotation for single controller
				obj.applyMatrix4(previousTransform);
				obj.applyMatrix4(controller1.matrixWorld);
				obj.updateMatrixWorld();
				previousTransform.copy(controller1.matrixWorld).invert();
			}
			//  else if (controller1 && controller2) {
			// 	// Handle scaling for two controllers
			// 	const currentDistance = controller1.position.distanceTo(
			// 		controller2.position
			// 	);
			// 	if (initialDistance.current === 0) {
			// 		initialDistance.current = currentDistance;
			// 	}

			// 	const scale = currentDistance / initialDistance.current;
			// 	const initScale = initialScale.current;
			// 	obj.scale.set(initScale.x, initScale.y, initScale.z);
			// 	obj.scale.multiplyScalar(scale);
			// }
		}

		if (globals.moveMode == "freecontrol") {
			if (controller1 && !controller2) {
				if (previousControllerPos.lengthSq() === 0) {
					previousControllerPos.copy(controller1.position);
					return;
				}
				let bbox = scene.getObjectByName("bbox");
				let bboxPos = bbox.position.clone();
				deltaController.subVectors(controller1.position, previousControllerPos);
				let edge2 = new Vector3().subVectors(previousControllerPos, bboxPos);
				let normal = new Vector3()
					.crossVectors(edge2, deltaController)
					.normalize();
				const rotationSpeed = 3;
				let angle = deltaController.length() * rotationSpeed;
				let quaternion = new Quaternion().setFromAxisAngle(normal, angle);
				bbox.applyQuaternion(quaternion);
				previousControllerPos.copy(controller1.position);
			} else if (controller1 && controller2) {
				// Handle scaling for two controllers
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
		intersectedObj.current = e.intersection?.object;
		console.log(
			"intersectedObj",
			intersectedObj.current.parent,
			intersectedObj.current.name
		);

		console.log("not child");
		globals.handIndex = e.target.index;
		console.log("hard", intersectedObj.current.name);
		if (
			intersectedObj.current.name === "bbox" &&
			globals.moveMode !== "freecontrol"
		) {
			globals.moveMode = "bbox";
		}

		console.log("handleSelectStart");
		if (globals.moveMode == "bbox" || globals.moveMode == "freecontrol") {
			const controller = e.target;
			// Determine if it's the first or second controller
			if (controller1Ref.current === undefined) {
				controller1Ref.current = controller.controller;
				previousTransform.copy(controller.controller.matrixWorld).invert();
				// initialScale.current = intersectedObj.current?.scale.clone();
				onSelectStart?.(e);
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
			} else if (globals.moveMode == "freecontrol") {
				previousControllerPos.copy(controller.controller.position);
			}
		}
	};

	const handleSelectEnd = (e) => {
		if (globals.moveMode == "bbox" || "freecontrol") {
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
				onSelectEnd?.(e);
				if (globals.moveMode === "bbox") {
					globals.moveMode = "off";
				}
				console.log("here off 7");
				globals.handIndex = -1;
			}
		}
	};

	const FreeSelectStartHandler = () => {
		const { controllers } = useXR();
		const { scene } = useThree();
		useFrame(() => {
			if (controllers && controllers[0] && controllers[1]) {
				if (globals.moveMode == "freecontrol") {
					if (controllers[0].hand) {
						if (controllers[0].hand.inputState.pinching == true) {
							intersectedObj.current = scene.getObjectByName("bbox");
							console.log("child", intersectedObj.current);
							console.log("free handleSelectStart", controllers[0]);
							console.log("constroller", controllers[0]);
							if (controller1Ref.current == undefined) {
								globals.handIndex = 0;
								controller1Ref.current = controllers[0].controller;
								previousTransform
									.copy(controller1Ref.current.matrixWorld)
									.invert();
								previousControllerPos.copy(controller1Ref.current.position);
							} else if (
								controller2Ref.current == undefined &&
								controller1Ref.current !== controllers[0].controller
							) {
								controller2Ref.current = controllers[0].controller;
							}
							initialScale.current = intersectedObj.current?.scale.clone();
							if (controller1Ref.current && controller2Ref.current) {
								initialDistance.current =
									controller1Ref.current.position.distanceTo(
										controller2Ref.current.position
									);
							}
						}
					}
					if (controllers[1].hand) {
						if (controllers[1].hand.inputState.pinching == true) {
							intersectedObj.current = scene.getObjectByName("bbox");
							console.log("child", intersectedObj.current);
							console.log("free handleSelectStart", controllers[1]);
							if (controller1Ref.current == undefined) {
								globals.handIndex = 1;
								console.log("wwweird");
								controller1Ref.current = controllers[1].controller;
								previousTransform
									.copy(controller1Ref.current.matrixWorld)
									.invert();
								previousControllerPos.copy(controller1Ref.current.position);
							} else if (
								controller2Ref.current == undefined &&
								controller1Ref.current !== controllers[1].controller
							) {
								controller2Ref.current = controllers[1].controller;
							}
							initialScale.current = intersectedObj.current?.scale.clone();
							if (controller1Ref.current && controller2Ref.current) {
								initialDistance.current =
									controller1Ref.current.position.distanceTo(
										controller2Ref.current.position
									);
							}
						}
					}
				}
			}
		});
	};

	const ReleaseSelectEndHandler = () => {
		const { controllers } = useXR();

		useFrame(() => {
			if (controllers && controllers[0] && controllers[1]) {
				if (
					globals.moveMode == "freecontrol" ||
					globals.moveMode == "bbox"
				) {
					if (controllers[0].hand) {
						if (
							controllers[0].hand.inputState.pinching == false &&
							globals.handIndex == 0
						) {
							console.log("handleSelectEnd", controllers[0]);
							if (controller1Ref.current === controllers[0].controller) {
								controller1Ref.current = undefined;
								console.log("hooo");
								if (controller2Ref.current) {
									console.log("haaa");
									previousTransform
										.copy(controller2Ref.current.matrixWorld)
										.invert();
									previousControllerPos.copy(controller2Ref.current.position);
									globals.handIndex = 1;
									console.log("set 1 here 1");
									controller1Ref.current = controller2Ref.current;
									controller2Ref.current = undefined;
								}
							} else if (controller2Ref.current === controllers[0].controller) {
								controller2Ref.current = undefined;
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
							onSelectEnd?.(e);
						}
					}
					if (controllers[1].hand) {
						if (
							controllers[1].hand.inputState.pinching == false &&
							globals.handIndex == 1
						) {
							console.log("handleSelectEnd", controllers[1]);
							if (controller1Ref.current === controllers[1].controller) {
								controller1Ref.current = undefined;
								console.log("hooo 11");
								if (controller2Ref.current) {
									console.log("haaa 11");
									previousTransform
										.copy(controller2Ref.current.matrixWorld)
										.invert();
									previousControllerPos.copy(controller2Ref.current.position);
									globals.handIndex = 0;
									controller1Ref.current = controller2Ref.current;
									controller2Ref.current = undefined;
								}
							} else if (controller2Ref.current === controllers[1].controller) {
								controller2Ref.current = undefined;
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
							onSelectEnd?.(e);
						}
					}
				}
			}
		});
	};

	return (
		<>
			<Interactive
				onSelectStart={handleSelectStart}
				onSelectEnd={handleSelectEnd}
				{...rest}
			>
				<FreeSelectStartHandler />
				<ReleaseSelectEndHandler />
				{children}
			</Interactive>
			{/* <Center bottom right position={[0, 2, -1]}>
				<Text name="result" color="gray" scale={0.05}>
					{`${t}`}
				</Text>
			</Center> */}
		</>
	);
}
