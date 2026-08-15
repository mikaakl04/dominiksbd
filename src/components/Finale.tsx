import { finaleContent } from "../data/content";
import { assetById, withBase } from "../lib/assets";
import { useReveal } from "../hooks/useReveal";

function FinaleImage({ id }: { id: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const asset = assetById(id);
  if (!asset) return null;
  return (
    <div ref={ref} className={`finale__image ${visible ? "is-visible" : ""}`}>
      <picture>
        {asset.srcWebp && <source srcSet={withBase(asset.srcWebp)} type="image/webp" />}
        <img src={withBase(asset.src)} alt="" loading="lazy" />
      </picture>
    </div>
  );
}

interface Props {
  onRewind: () => void;
}

export default function Finale({ onRewind }: Props) {
  return (
    <section className="finale" id="finale">
      <div className="finale__grain" aria-hidden="true" />
      <div className="container finale__content">
        <div className="finale__gallery">
          <FinaleImage id="italien-03" />
          <FinaleImage id="sommer-06" />
          <FinaleImage id="paris-06" />
        </div>

        <div className="finale__text">
          {finaleContent.lines.map((line, i) => (
            <p key={i} className="finale__line" style={{ animationDelay: `${0.3 + i * 1.1}s` }}>
              {line}
            </p>
          ))}
          <p className="finale__promise">{finaleContent.promise}</p>
        </div>

        <div className="finale__polaroid">
          <div className="finale__polaroid-frame">
            <span className="finale__loading">{finaleContent.loading}</span>
          </div>
        </div>

        <div className="finale__birthday">
          <span className="kicker">Happy Birthday</span>
          <h2 className="finale__name">{finaleContent.name}</h2>
          <p className="finale__personal">{finaleContent.personal}</p>
          <p className="finale__outro">{finaleContent.outro}</p>
        </div>

        <button className="finale__rewind" onClick={onRewind}>
          <span className="finale__rewind-icon" aria-hidden="true">
            ⟲
          </span>
          <span>{finaleContent.rewind}</span>
        </button>
      </div>
    </section>
  );
}
