import React, { useState } from 'react';
import { validateForm, isFormValid } from '../utils/validators';
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (isFormValid(newErrors)) {
      localStorage.setItem('registeredUser', JSON.stringify(formData));
      setSubmitted(true);
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

      <button type="submit">S'inscrire</button>
    </form>
  );
}

export default RegisterForm;
