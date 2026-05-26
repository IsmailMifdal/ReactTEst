"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("./App.css");
var _RegisterForm = _interopRequireDefault(require("./components/RegisterForm"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Composant racine de l'application.
 * Affiche le formulaire d'inscription.
 */function App() {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: "App",
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {})
  });
}
var _default = exports.default = App;