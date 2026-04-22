import Wordmark from './Wordmark';

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-white/5 bg-ink-900/60">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Wordmark size="lg" />
            <p className="mt-4 text-[15px] leading-relaxed text-frost-300">
              A personal photography project by Kirnesh. Notes from above the
              clouds — shared in the belief that the mountains are best remembered
              slowly.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-[13px]">
            <FooterCol title="The Work">
              <FooterLink href="/">Stories</FooterLink>
              <FooterLink href="/#collections">Collections</FooterLink>
              <FooterLink href="/#journal">Journal</FooterLink>
            </FooterCol>
            <FooterCol title="About">
              <FooterLink href="/#about">Credo</FooterLink>
              <FooterLink href="/#about">Gear</FooterLink>
              <FooterLink href="/login">Studio</FooterLink>
            </FooterCol>
            <FooterCol title="Elsewhere">
              <FooterLink href="#" external>Instagram</FooterLink>
              <FooterLink href="#" external>500px</FooterLink>
              <FooterLink href="mailto:hello@kirneshflix.app">Write</FooterLink>
            </FooterCol>
          </div>
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-[12px] text-frost-400">
          <p>© {new Date().getFullYear()} Kirneshflix. A photography journal.</p>
          <p className="tabular">Made with patience, wool, and a wide-angle lens.</p>
        </div>
      </div>
    </footer>
  );
};

const FooterCol = ({ title, children }) => (
  <div>
    <div className="text-[11px] uppercase tracking-[0.18em] text-frost-400 mb-3">
      {title}
    </div>
    <ul className="space-y-2">{children}</ul>
  </div>
);

const FooterLink = ({ href, children, external = false }) => (
  <li>
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="text-frost-200 hover:text-frost-50 transition-colors"
    >
      {children}
    </a>
  </li>
);

export default Footer;
