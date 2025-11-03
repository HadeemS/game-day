import Section from '../components/Section'


export default function About(){
return (
<div className="stack-lg">
<Section kicker="About Us" title="Our Mission">
<p>Port your “About Us / Our Mission / Meet the Team” content here. You can split into multiple `Section`s.</p>
</Section>


<Section title="Meet the Team">
<p>Insert team bios or cards. Later, this can be a JSON-driven list.</p>
</Section>
</div>
)
}