"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _validators = require("../utils/validators");
require("./RegisterForm.css");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
const INITIAL_STATE = {
  nom: '',
  prenom: '',
  email: '',
  dateDeNaissance: '',
  ville: '',
  codePostal: ''
};
function RegisterForm() {
  const _useState = (0, _react.useState)(INITIAL_STATE),
    _useState2 = _slicedToArray(_useState, 2),
    formData = _useState2[0],
    setFormData = _useState2[1];
  const _useState3 = (0, _react.useState)({}),
    _useState4 = _slicedToArray(_useState3, 2),
    errors = _useState4[0],
    setErrors = _useState4[1];
  const _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    submitted = _useState6[0],
    setSubmitted = _useState6[1];
  const handleChange = e => {
    const _e$target = e.target,
      name = _e$target.name,
      value = _e$target.value;
    setFormData(prev => _objectSpread(_objectSpread({}, prev), {}, {
      [name]: value
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    const newErrors = (0, _validators.validateForm)(formData);
    setErrors(newErrors);
    if ((0, _validators.isFormValid)(newErrors)) {
      localStorage.setItem('registeredUser', JSON.stringify(formData));
      setSubmitted(true);
    }
  };
  if (submitted) {
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "register-success",
      "data-testid": "success-message",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h2", {
        children: "Inscription r\xE9ussie !"
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
        children: ["Bienvenue, ", /*#__PURE__*/(0, _jsxRuntime.jsxs)("strong", {
          children: [formData.prenom, " ", formData.nom]
        }), " !"]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
        children: ["Un email de confirmation sera envoy\xE9 \xE0 ", formData.email, "."]
      })]
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("form", {
    onSubmit: handleSubmit,
    className: "register-form",
    "aria-label": "Formulaire d'inscription",
    noValidate: true,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
      children: "Inscription"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "form-group",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
        htmlFor: "nom",
        children: "Nom"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        id: "nom",
        name: "nom",
        type: "text",
        value: formData.nom,
        onChange: handleChange,
        "aria-describedby": errors.nom ? 'nom-error' : undefined
      }), errors.nom && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        id: "nom-error",
        className: "field-error",
        role: "alert",
        children: errors.nom
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "form-group",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
        htmlFor: "prenom",
        children: "Pr\xE9nom"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        id: "prenom",
        name: "prenom",
        type: "text",
        value: formData.prenom,
        onChange: handleChange,
        "aria-describedby": errors.prenom ? 'prenom-error' : undefined
      }), errors.prenom && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        id: "prenom-error",
        className: "field-error",
        role: "alert",
        children: errors.prenom
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "form-group",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
        htmlFor: "email",
        children: "Email"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        id: "email",
        name: "email",
        type: "email",
        value: formData.email,
        onChange: handleChange,
        "aria-describedby": errors.email ? 'email-error' : undefined
      }), errors.email && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        id: "email-error",
        className: "field-error",
        role: "alert",
        children: errors.email
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "form-group",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
        htmlFor: "dateDeNaissance",
        children: "Date de naissance"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        id: "dateDeNaissance",
        name: "dateDeNaissance",
        type: "date",
        value: formData.dateDeNaissance,
        onChange: handleChange,
        "aria-describedby": errors.dateDeNaissance ? 'dateDeNaissance-error' : undefined
      }), errors.dateDeNaissance && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        id: "dateDeNaissance-error",
        className: "field-error",
        role: "alert",
        children: errors.dateDeNaissance
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "form-group",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
        htmlFor: "ville",
        children: "Ville"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        id: "ville",
        name: "ville",
        type: "text",
        value: formData.ville,
        onChange: handleChange,
        "aria-describedby": errors.ville ? 'ville-error' : undefined
      }), errors.ville && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        id: "ville-error",
        className: "field-error",
        role: "alert",
        children: errors.ville
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "form-group",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
        htmlFor: "codePostal",
        children: "Code postal"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        id: "codePostal",
        name: "codePostal",
        type: "text",
        value: formData.codePostal,
        onChange: handleChange,
        maxLength: 5,
        "aria-describedby": errors.codePostal ? 'codePostal-error' : undefined
      }), errors.codePostal && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        id: "codePostal-error",
        className: "field-error",
        role: "alert",
        children: errors.codePostal
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
      type: "submit",
      children: "S'inscrire"
    })]
  });
}
var _default = exports.default = RegisterForm;