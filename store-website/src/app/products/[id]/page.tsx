export default function About({ params }: { params: { id: string } }) {
	return <div>{params.id}</div>;
}
