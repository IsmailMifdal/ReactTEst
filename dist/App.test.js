"use strict";

var _react = require("@testing-library/react");
var _App = _interopRequireDefault(require("./App"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Tests d'intégration du composant App.
 */describe('App', () => {
  test("affiche le formulaire d'inscription", () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App.default, {}));
    expect(_react.screen.getByRole('heading', {
      name: /inscription/i
    })).toBeInTheDocument();
  });
  test("affiche le bouton S'inscrire", () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App.default, {}));
    expect(_react.screen.getByRole('button', {
      name: /s'inscrire/i
    })).toBeInTheDocument();
  });
});