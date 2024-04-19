export function HoldingPoints({ objScale, boxLength }) {
	return (
		<>
			<mesh
				name="holdingPoint0"
				position={[
					objScale[0] * 0.55 * boxLength[0],
					-objScale[1] * 0.55 * boxLength[1],
					objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"orange"} transparent opacity={0.8} />
			</mesh>
			<mesh
				name="holdingPoint1"
				position={[
					objScale[0] * 0.55 * boxLength[0],
					objScale[1] * 0.55 * boxLength[1],
					objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"orange"} transparent opacity={0.8} />
			</mesh>
			<mesh
				name="holdingPoint2"
				position={[
					objScale[0] * 0.55 * boxLength[0],
					-objScale[1] * 0.55 * boxLength[1],
					-objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"orange"} transparent opacity={0.8} />
			</mesh>
			<mesh
				name="holdingPoint3"
				position={[
					objScale[0] * 0.55 * boxLength[0],
					objScale[1] * 0.55 * boxLength[1],
					-objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"orange"} transparent opacity={0.8} />
			</mesh>
			<mesh
				name="holdingPoint4"
				position={[
					-objScale[0] * 0.55 * boxLength[0],
					-objScale[1] * 0.55 * boxLength[1],
					objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"orange"} transparent opacity={0.8} />
			</mesh>
			<mesh
				name="holdingPoint5"
				position={[
					-objScale[0] * 0.55 * boxLength[0],
					objScale[1] * 0.55 * boxLength[1],
					objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"orange"} transparent opacity={0.8} />
			</mesh>
			<mesh
				name="holdingPoint6"
				position={[
					-objScale[0] * 0.55 * boxLength[0],
					-objScale[1] * 0.55 * boxLength[1],
					-objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"orange"} transparent opacity={0.8} />
			</mesh>
			<mesh
				name="holdingPoint7"
				position={[
					-objScale[0] * 0.55 * boxLength[0],
					objScale[1] * 0.55 * boxLength[1],
					-objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"orange"} transparent opacity={0.8} />
			</mesh>
		</>
	);
}
