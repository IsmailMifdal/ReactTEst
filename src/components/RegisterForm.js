import React, { useState } from 'react';
import { validateForm, isFormValid } from '../utils/validators';
import { registerUser, countUsers } from '../api';
import './RegisterForm.css';

const INITIAL_STATE = {
  nom: '',
  prenom: '',
  email: '',
  dateDeNaissance: '',
  ville: '',
  codePostal: '',
};


function RegisterForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [userCount, setUserCount] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (!isFormValid(newErrors)) {
      return;
    }

    setSubmitting(true);
    setApiError(null);
    try {
      // On délègue l'inscription au service tiers au lieu du localStorage
      await registerUser(formData);
      const count = await countUsers();
      setUserCount(count);
      setSubmitted(true);
    } catch (err) {
      setApiError(
        "L'inscription a échoué. Veuillez réessayer plus tard."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="register-success" data-testid="success-message">
        <h2>Inscription réussie !</h2>
        <p>
          Bienvenue, <strong>{formData.prenom} {formData.nom}</strong> !
        </p>
        <p>Un email de confirmation sera envoyé à {formData.email}.</p>
        {userCount !== null && (
          <p data-testid="user-count">
            Nombre d'utilisateurs inscrits : <strong>{userCount}</strong>
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="register-form"
      aria-label="Formulaire d'inscription"
      noValidate
    >
      <h1>Inscription</h1>

      {apiError && (
        <div className="api-error" role="alert" data-testid="api-error">
          {apiError}
        </div>
      )}

      {/* Nom */}
      <div className="form-group">
        <label htmlFor="nom">Nom</label>
        <input
          id="nom"
          name="nom"
          type="text"
          value={formData.nom}
          onChange={handleChange}
          aria-describedby={errors.nom ? 'nom-error' : undefined}
        />
        {errors.nom && (
          <span id="nom-error" className="field-error" role="alert">
            {errors.nom}
          </span>
        )}
      </div>

      {/* Prénom */}
      <div className="form-group">
        <label htmlFor="prenom">Prénom</label>
        <input
          id="prenom"
          name="prenom"
          type="text"
          value={formData.prenom}
          onChange={handleChange}
          aria-describedby={errors.prenom ? 'prenom-error' : undefined}
        />
        {errors.prenom && (
          <span id="prenom-error" className="field-error" role="alert">
            {errors.prenom}
          </span>
        )}
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className="field-error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      {/* Date de naissance */}
      <div className="form-group">
        <label htmlFor="dateDeNaissance">Date de naissance</label>
        <input
          id="dateDeNaissance"
          name="dateDeNaissance"
          type="date"
          value={formData.dateDeNaissance}
          onChange={handleChange}
          aria-describedby={errors.dateDeNaissance ? 'dateDeNaissance-error' : undefined}
        />
        {errors.dateDeNaissance && (
          <span id="dateDeNaissance-error" className="field-error" role="alert">
            {errors.dateDeNaissance}
          </span>
        )}
      </div>

      {/* Ville */}
      <div className="form-group">
        <label htmlFor="ville">Ville</label>
        <input
          id="ville"
          name="ville"
          type="text"
          value={formData.ville}
          onChange={handleChange}
          aria-describedby={errors.ville ? 'ville-error' : undefined}
        />
        {errors.ville && (
          <span id="ville-error" className="field-error" role="alert">
            {errors.ville}
          </span>
        )}
      </div>

      {/* Code postal */}
      <div className="form-group">
        <label htmlFor="codePostal">Code postal</label>
        <input
          id="codePostal"
          name="codePostal"
          type="text"
          value={formData.codePostal}
          onChange={handleChange}
          maxLength={5}
          aria-describedby={errors.codePostal ? 'codePostal-error' : undefined}
        />
        {errors.codePostal && (
          <span id="codePostal-error" className="field-error" role="alert">
            {errors.codePostal}
          </span>
        )}
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Envoi en cours…' : "S'inscrire"}
      </button>
    </form>
  );
}

export default RegisterForm;
