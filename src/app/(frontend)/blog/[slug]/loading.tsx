import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Loading() {
  return (
    <>
      <Nav />
      <main className="post-page">
        <div className="post-grid">
          <article className="article">
            <div className="crumbs">
              <span className="skeleton skel-line" style={{ width: 220 }} />
            </div>
            <div className="article__head">
              <span className="skeleton" style={{ width: 60, height: 22, borderRadius: 999, marginBottom: 18, display: "block" }} />
              <span className="skeleton skel-line" style={{ width: "75%", height: 32, marginBottom: 12 }} />
              <span className="skeleton skel-line" style={{ width: "55%", height: 32, marginBottom: 18 }} />
              <span className="skeleton skel-line" style={{ width: 200 }} />
            </div>
            <div className="article__hero">
              <span className="skeleton skel-thumb-wide" style={{ width: "100%" }} />
            </div>
            <div className="article__body">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <span
                  key={i}
                  className="skeleton skel-line"
                  style={{
                    width: i % 3 === 2 ? "70%" : "100%",
                    marginBottom: 14,
                    height: 14,
                  }}
                />
              ))}
            </div>
          </article>

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
        </div>
      </main>
      <Footer />
    </>
  );
}
