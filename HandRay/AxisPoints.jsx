export function AxisPoints({ objScale, boxLength }) {
	return (
		<>
			<mesh
				name="startPointX"
				position={[objScale[0] * 0.5 * boxLength[0], 0, 0]}
			>
				<sphereGeometry args={[0.02]} />
				<meshStandardMaterial color={"orange"} transparent opacity={1} />
			</mesh>
			<mesh
				name="endPointX"
				position={[-objScale[0] * 0.5 * boxLength[0], 0, 0]}
			>
				<sphereGeometry args={[0.02]} />
				<meshStandardMaterial color={"blue"} transparent opacity={1} />
			</mesh>
			<mesh
				name="startPointY"
				position={[0, objScale[1] * 0.5 * boxLength[1], 0]}
			>
				<sphereGeometry args={[0.02]} />
				<meshStandardMaterial color={"black"} transparent opacity={1} />
			</mesh>
			<mesh
				name="endPointY"
				position={[0, -objScale[1] * 0.5 * boxLength[1], 0]}
			>
				<sphereGeometry args={[0.02]} />
				<meshStandardMaterial color={"purple"} transparent opacity={1} />
			</mesh>
			<mesh
				name="startPointZ"
				position={[0, 0, objScale[2] * 0.5 * boxLength[2]]}
			>
				<sphereGeometry args={[0.02]} />
				<meshStandardMaterial color={"red"} transparent opacity={1} />
			</mesh>
			<mesh
				name="endPointZ"
				position={[0, 0, -objScale[2] * 0.5 * boxLength[2]]}
			>
				<sphereGeometry args={[0.02]} />
				<meshStandardMaterial color={"green"} transparent opacity={1} />
			</mesh>
		</>
	);
}
