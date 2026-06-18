import React from 'react';

/**
 * Liste des utilisateurs (informations réduites).
 * Si l'utilisateur courant est admin, affiche les actions "Détails" et "Supprimer".
 *
 * @param {Object} props
 * @param {Array} props.users
 * @param {boolean} props.isAdmin
 * @param {(id:number)=>void} [props.onViewDetail]
 * @param {(id:number)=>void} [props.onDelete]
 */
function UserList({ users, isAdmin, onViewDetail, onDelete }) {
  if (!users || users.length === 0) {
    return <p data-testid="empty-list">Aucun utilisateur inscrit.</p>;
  }

  return (
    <ul className="user-list" data-testid="user-list">
      {users.map((user) => (
        <li key={user.id} data-testid={`user-${user.id}`}>
          <span className="user-info">
            {user.prenom} {user.nom} — {user.ville}
          </span>

          {isAdmin && (
            <span className="user-actions">
              <button
                type="button"
                onClick={() => onViewDetail(user.id)}
                data-testid={`detail-${user.id}`}
              >
                Détails
              </button>
              <button
                type="button"
                onClick={() => onDelete(user.id)}
                data-testid={`delete-${user.id}`}
              >
                Supprimer
              </button>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default UserList;
