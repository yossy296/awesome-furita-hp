import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BlogHero from "@/components/blog/BlogHero";

export default function Loading() {
  return (
    <>
      <Nav />
      <main className="blog-page">
        <BlogHero />
        <section className="blog-grid">
          <div className="posts">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="post" style={{ pointerEvents: "none" }}>
                <span className="skeleton skel-thumb post__thumb" style={{ background: undefined }} />
                <div className="post__body">
                  <span className="skeleton skel-line" style={{ width: 80, marginBottom: 14 }} />
                  <span className="skeleton skel-line" style={{ width: "70%", height: 18, marginBottom: 12 }} />
                  <span className="skeleton skel-line" style={{ width: "100%", marginBottom: 6 }} />
                  <span className="skeleton skel-line" style={{ width: "85%", marginBottom: 16 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <span className="skeleton" style={{ width: 60, height: 22, borderRadius: 999 }} />
                    <span className="skeleton" style={{ width: 60, height: 22, borderRadius: 999 }} />
                    <span className="skeleton" style={{ width: 60, height: 22, borderRadius: 999 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="side">
            <span className="skeleton" style={{ height: 44, borderRadius: 999 }} />
            <section className="side__block">
              <span className="skeleton skel-line" style={{ width: 120, marginBottom: 18 }} />
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="skeleton skel-line"
                  style={{ width: "100%", marginBottom: 18 }}
                />
              ))}
            </section>
            <section className="side__block">
              <span className="skeleton skel-line" style={{ width: 140, marginBottom: 18 }} />
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                  <span className="skeleton" style={{ width: 84, height: 64, borderRadius: 12 }} />
                  <div style={{ flex: 1 }}>
                    <span className="skeleton skel-line" style={{ width: "90%", marginBottom: 8 }} />
                    <span className="skeleton skel-line" style={{ width: "60%" }} />
                  </div>
                </div>
              ))}
            </section>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
