import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useKeyboard from "./useKeyboard";
import { Quaternion, Vector3 } from "three";
import { useThree } from "@react-three/fiber";

export function KeyboardControl({ children, props }) {
	const ref = useRef();
	const keyMap = useKeyboard();
    const { scene } = useThree();

	let angle = 0;
	let quaternion = new Quaternion();

	function updateRotation(delta) {
		let rotationSpeed = 0.03;
		let currentAxis = new Vector3(1, 0, 0);
		if (keyMap["KeyD"]) {
			currentAxis.set(0, 1, 0);
		} else if (keyMap["KeyA"]) {
            currentAxis.set(0, -1, 0);
        } else if (keyMap["KeyS"]) {
            currentAxis.set(1, 0, 0);
        } else if (keyMap["KeyW"]) {
            currentAxis.set(-1, 0, 0);
        } else if (keyMap["KeyE"]) {
            currentAxis.set(0, 0, -1);
        } else if (keyMap["KeyQ"]) {
            currentAxis.set(0, 0, 1);
        }

		if (keyMap["KeyA"] || keyMap["KeyD"] || keyMap["KeyW"] || keyMap["KeyS"] || keyMap["KeyQ"] || keyMap["KeyE"]) {
			angle += delta * rotationSpeed;
			quaternion.setFromAxisAngle(currentAxis, angle);
            let obj = scene.getObjectByName(children.props.name);
			obj.applyQuaternion(quaternion);
		}
	}

	useFrame((_, delta) => {
		keyMap["ArrowLeft"] && (ref.current.position.x -= 1 * delta);
		keyMap["ArrowRight"] && (ref.current.position.x += 1 * delta);
		!keyMap["ShiftLeft"] &&
			keyMap["ArrowDown"] &&
			(ref.current.position.y -= 1 * delta);
		!keyMap["ShiftLeft"] &&
			keyMap["ArrowUp"] &&
			(ref.current.position.y += 1 * delta);
		keyMap["ShiftLeft"] &&
			keyMap["ArrowUp"] &&
			(ref.current.position.z -= 1 * delta);
		keyMap["ShiftLeft"] &&
			keyMap["ArrowDown"] &&
			(ref.current.position.z += 1 * delta);
		updateRotation(delta);
	});

	return (
		<mesh ref={ref} {...props}>
			{children}
		</mesh>
	);
}
