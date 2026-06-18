import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, getUserDetail, deleteUser } from '../api';
import { useAuth } from '../context/AuthContext';
import UserList from '../components/UserList';

/**
 * Page d'accueil :
 *  - affiche le nombre d'utilisateurs inscrits + la liste (infos réduites)
 *  - en mode admin : consultation des infos privées et suppression
 */
function HomePage() {
  const { isAdmin, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [detail, setDetail] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      const list = await getUsers();
      setUsers(list);
      setError(false);
    } catch (err) {
      setError(true);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleViewDetail = async (id) => {
    try {
      const data = await getUserDetail(id, token);
      setDetail(data);
    } catch (err) {
      setError(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id, token);
      if (detail && detail.id === id) setDetail(null);
      await loadUsers();
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="home-page">
      <h1>Accueil</h1>

      {error ? (
        <p role="alert" data-testid="home-error">
          Impossible de récupérer les utilisateurs.
        </p>
      ) : (
        <p data-testid="user-count-home">
          {`${users.length} user(s) already registered`}
        </p>
      )}

      <UserList
        users={users}
        isAdmin={isAdmin}
        onViewDetail={handleViewDetail}
        onDelete={handleDelete}
      />

      {detail && (
        <div className="user-detail" data-testid="user-detail">
          <h2>Informations privées</h2>
          <p>Nom : {detail.nom}</p>
          <p>Prénom : {detail.prenom}</p>
          <p>Email : {detail.email}</p>
          <p>Date de naissance : {detail.date_naissance || '—'}</p>
          <p>Ville : {detail.ville || '—'}</p>
          <p>Code postal : {detail.code_postal || '—'}</p>
          <button type="button" onClick={() => setDetail(null)} data-testid="close-detail">
            Fermer
          </button>
        </div>
      )}

      <Link to="/register" data-testid="go-to-register">
        S'inscrire
      </Link>
    </div>
  );
}

export default HomePage;
