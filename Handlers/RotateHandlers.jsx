export function RotateHandlers({ objScale, boxLength }) {
	return (
		<>
			{/* x axis 4 boxes */}
			<mesh
				name="rotateHandler0"
				position={[
					0,
					-objScale[1] * 0.55 * boxLength[1],
					objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.6,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"orange"} transparent opacity={0.5} />
			</mesh>
			<mesh
				name="rotateHandler1"
				position={[
					0,
					objScale[1] * 0.55 * boxLength[1],
					objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.6,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"orange"} transparent opacity={0.5} />
			</mesh>
			<mesh
				name="rotateHandler2"
				position={[
					0,
					objScale[1] * 0.55 * boxLength[1],
					-objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.6,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"orange"} transparent opacity={0.5} />
			</mesh>
			<mesh
				name="rotateHandler3"
				position={[
					0,
					-objScale[1] * 0.55 * boxLength[1],
					-objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.6,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"orange"} transparent opacity={0.5} />
			</mesh>
			{/* y axis 4 boxes */}
			<mesh
				name="rotateHandler4"
				position={[
					-objScale[0] * 0.55 * boxLength[0],
					0,
					objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.6,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"red"} transparent opacity={0.5} />
			</mesh>
			<mesh
				name="rotateHandler5"
				position={[
					-objScale[0] * 0.55 * boxLength[0],
					0,
					-objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.6,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"red"} transparent opacity={0.5} />
			</mesh>
			<mesh
				name="rotateHandler6"
				position={[
					objScale[0] * 0.55 * boxLength[0],
					0,
					objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.6,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"red"} transparent opacity={0.5} />
			</mesh>
			<mesh
				name="rotateHandler7"
				position={[
					objScale[0] * 0.55 * boxLength[0],
					0,
					-objScale[2] * 0.55 * boxLength[2],
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.6,
						objScale[2] * boxLength[2] * 0.1,
					]}
				/>
				<meshStandardMaterial color={"red"} transparent opacity={0.5} />
			</mesh>
			{/* z axis 4 boxes */}
			<mesh
				name="rotateHandler8"
				position={[
					-objScale[0] * 0.55 * boxLength[0],
					objScale[1] * 0.55 * boxLength[1],
					0,
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.6,
					]}
				/>
				<meshStandardMaterial color={"blue"} transparent opacity={0.5} />
			</mesh>
			<mesh
				name="rotateHandler9"
				position={[
					-objScale[0] * 0.55 * boxLength[0],
					-objScale[1] * 0.55 * boxLength[1],
					0,
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.6,
					]}
				/>
				<meshStandardMaterial color={"blue"} transparent opacity={0.5} />
			</mesh>
			<mesh
				name="rotateHandler10"
				position={[
					objScale[0] * 0.55 * boxLength[0],
					objScale[1] * 0.55 * boxLength[1],
					0,
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.6,
					]}
				/>
				<meshStandardMaterial color={"blue"} transparent opacity={0.5} />
			</mesh>
			<mesh
				name="rotateHandler11"
				position={[
					objScale[0] * 0.55 * boxLength[0],
					-objScale[1] * 0.55 * boxLength[1],
					0,
				]}
			>
				<boxGeometry
					args={[
						objScale[0] * boxLength[0] * 0.1,
						objScale[1] * boxLength[1] * 0.1,
						objScale[2] * boxLength[2] * 0.6,
					]}
				/>
				<meshStandardMaterial color={"blue"} transparent opacity={0.5} />
			</mesh>
		</>
	);
}
