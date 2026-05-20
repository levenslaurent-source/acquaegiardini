export default function CompanySettings({ company, onChange }) {
  function patch(fields) {
    onChange({ ...company, ...fields });
  }

  return (
    <div className="settings">
      <div className="settings-head">
        <h1>Coordonnées de l’entreprise</h1>
        <p className="settings-hint">
          Ces informations apparaissent en en-tête de chaque bon de commande.
          Elles sont enregistrées dans ce navigateur.
        </p>
      </div>

      <section className="card">
        <h2 className="card-title">Identité</h2>
        <div className="grid grid-2">
          <label className="field">
            <span>Nom de l’entreprise</span>
            <input
              type="text"
              value={company.name}
              onChange={(e) => patch({ name: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Slogan / activité</span>
            <input
              type="text"
              value={company.tagline}
              onChange={(e) => patch({ tagline: e.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Adresse et contact</h2>
        <div className="grid grid-2">
          <label className="field field-wide">
            <span>Adresse</span>
            <input
              type="text"
              value={company.address}
              onChange={(e) => patch({ address: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Code postal</span>
            <input
              type="text"
              value={company.zip}
              onChange={(e) => patch({ zip: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Ville</span>
            <input
              type="text"
              value={company.city}
              onChange={(e) => patch({ city: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Téléphone</span>
            <input
              type="tel"
              value={company.phone}
              onChange={(e) => patch({ phone: e.target.value })}
            />
          </label>
          <label className="field">
            <span>E-mail</span>
            <input
              type="email"
              value={company.email}
              onChange={(e) => patch({ email: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Site web</span>
            <input
              type="text"
              value={company.website}
              onChange={(e) => patch({ website: e.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Mentions légales</h2>
        <div className="grid grid-2">
          <label className="field">
            <span>SIRET</span>
            <input
              type="text"
              value={company.siret}
              onChange={(e) => patch({ siret: e.target.value })}
            />
          </label>
          <label className="field">
            <span>N° de TVA intracommunautaire</span>
            <input
              type="text"
              value={company.tvaNumber}
              onChange={(e) => patch({ tvaNumber: e.target.value })}
            />
          </label>
        </div>
      </section>
    </div>
  );
}
