"use client";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 px-12 py-6 flex items-center justify-between bg-sahara/80 backdrop-blur-md -webkit-backdrop-blur-md border-b border-charcoal/5">
            <div className="flex items-center gap-4">
                <span className="text-2xl font-serif text-gold">ⵣ</span>
                <span className="tracking-[0.3em] uppercase text-[10px] font-bold text-charcoal">OUROZ</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
                {['Collective', 'Atelier', 'Studio', 'Intelligence'].map((item) => (
                    <a key={item} href="#" className="text-[10px] uppercase tracking-widest text-charcoal/60 hover:text-gold transition-colors">
                        {item}
                    </a>
                ))}
            </nav>

            <div className="flex items-center gap-6">
                <div className="flex bg-charcoal/5 rounded-full p-1 scale-90">
                    <button className="px-4 py-1 rounded-full text-[9px] uppercase font-bold bg-white shadow-sm">Curator</button>
                    <button className="px-4 py-1 rounded-full text-[9px] uppercase font-bold text-charcoal/30">Syndicate</button>
                </div>
                <div className="w-8 h-8 rounded-full border border-charcoal/10 flex items-center justify-center text-[10px]">A</div>
            </div>
        </header>
    );
}
