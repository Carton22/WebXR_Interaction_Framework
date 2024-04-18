import { useRef, useMemo } from "react";
import { Object3D, Matrix4, Vector3, Quaternion } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Interactive, useXR } from "@react-three/xr";
import { globals } from "./ARApp";

function calculateAxis(startPoint, endPoint) {
	let start = new Vector3(
		startPoint.matrixWorld.elements[12],
		startPoint.matrixWorld.elements[13],
		startPoint.matrixWorld.elements[14]
	);
	let end = new Vector3(
		endPoint.matrixWorld.elements[12],
		endPoint.matrixWorld.elements[13],
		endPoint.matrixWorld.elements[14]
	);
	const axis = new Vector3().subVectors(start, end).normalize();
	return axis;
}

export function EnhancedRayGrab({
	setPlayM,
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
	let rotateAxis = new Vector3(1, 0, 0);

	useFrame(() => {
		const controller1 = controller1Ref.current;
		const controller2 = controller2Ref.current;

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

		if (globals.moveMode == "holdingRotateHandler") {
			if (controller1) {
				if (previousControllerPos.lengthSq() === 0) {
					previousControllerPos.copy(controller1.position);
					return;
				}
				deltaController.subVectors(controller1.position, previousControllerPos);
				console.log("ggggg", obj.parent);
				const rotationSpeed = 3;
				let startPointX = scene.getObjectByName("startPointX");
				let endPointX = scene.getObjectByName("endPointX");
				let Xaxis = calculateAxis(startPointX, endPointX);
				console.log("Xaxis", Xaxis);
				let startPointY = scene.getObjectByName("startPointY");
				let endPointY = scene.getObjectByName("endPointY");
				let Yaxis = calculateAxis(startPointY, endPointY);
				console.log("Yaxis", Yaxis);
				let startPointZ = scene.getObjectByName("startPointZ");
				let endPointZ = scene.getObjectByName("endPointZ");
				let Zaxis = calculateAxis(startPointZ, endPointZ);
				console.log("Zaxis", Zaxis);
				if (
					obj.name === "rotateHandler0" ||
					obj.name === "rotateHandler1" ||
					obj.name === "rotateHandler2" ||
					obj.name === "rotateHandler3"
				) {
					if (deltaController.y > 0) {
						rotateAxis.copy(Xaxis);
					} else {
						rotateAxis.copy(Xaxis.clone().negate());
					}
				} else if (
					obj.name === "rotateHandler4" ||
					obj.name === "rotateHandler5" ||
					obj.name === "rotateHandler6" ||
					obj.name === "rotateHandler7"
				) {
					if (deltaController.x > 0) {
						rotateAxis.copy(Yaxis);
					} else {
						rotateAxis.copy(Yaxis.clone().negate());
					}
				} else if (
					obj.name === "rotateHandler8" ||
					obj.name === "rotateHandler9" ||
					obj.name === "rotateHandler10" ||
					obj.name === "rotateHandler11"
				) {
					if (deltaController.z > 0) {
						rotateAxis.copy(Zaxis);
					} else {
						rotateAxis.copy(Zaxis.clone().negate());
					}
				}

				let angle = deltaController.length() * rotationSpeed;
				let quaternion = new Quaternion().setFromAxisAngle(rotateAxis, angle);
				let bbox = scene.getObjectByName("bbox");
				bbox.applyQuaternion(quaternion);
				previousControllerPos.copy(controller1.position);
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
		}, 500);
		intersectedObj.current = e.intersection?.object;
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
		} else if (
			(intersectedObj.current.name === "rotateHandler0" ||
				intersectedObj.current.name === "rotateHandler1" ||
				intersectedObj.current.name === "rotateHandler2" ||
				intersectedObj.current.name === "rotateHandler3" ||
				intersectedObj.current.name === "rotateHandler4" ||
				intersectedObj.current.name === "rotateHandler5" ||
				intersectedObj.current.name === "rotateHandler6" ||
				intersectedObj.current.name === "rotateHandler7" ||
				intersectedObj.current.name === "rotateHandler8" ||
				intersectedObj.current.name === "rotateHandler9" ||
				intersectedObj.current.name === "rotateHandler10" ||
				intersectedObj.current.name === "rotateHandler11") &&
			globals.moveMode !== "insideBbox"
		) {
			// console.log("hihihihi");
			globals.moveMode = "holdingRotateHandler";
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
						console.log("free release", globals.handIndex);
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
						}
					}
					if (controllers[1].hand) {
						console.log("free release 2", globals.handIndex);
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
			<ReleaseSelectEndHandler />
			{children}
		</Interactive>
	);
}
