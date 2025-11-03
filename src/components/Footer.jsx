export default function Footer(){
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p>© {new Date().getFullYear()} GameDay • Built with React</p>
      </div>
    </footer>
  )
}