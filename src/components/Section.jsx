export default function Section({ title, kicker, children }){
return (
<section className="section">
{kicker && <p className="kicker">{kicker}</p>}
{title && <h2 className="h2">{title}</h2>}
<div className="section__content">
{children}
</div>
</section>
)
}