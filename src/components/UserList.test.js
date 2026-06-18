import { render, screen, fireEvent } from '@testing-library/react';
import UserList from './UserList';

const USERS = [
  { id: 1, nom: 'Martin', prenom: 'Alice', ville: 'Paris' },
  { id: 2, nom: 'Durand', prenom: 'Bob', ville: 'Lyon' },
];

describe('UserList', () => {
  test('affiche un message si la liste est vide', () => {
    render(<UserList users={[]} isAdmin={false} />);
    expect(screen.getByTestId('empty-list')).toBeInTheDocument();
  });

  test('affiche les utilisateurs (infos réduites)', () => {
    render(<UserList users={USERS} isAdmin={false} />);
    expect(screen.getByText(/Alice Martin — Paris/)).toBeInTheDocument();
    expect(screen.getByText(/Bob Durand — Lyon/)).toBeInTheDocument();
  });

  test('n\'affiche pas les actions admin pour un visiteur', () => {
    render(<UserList users={USERS} isAdmin={false} />);
    expect(screen.queryByTestId('delete-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('detail-1')).not.toBeInTheDocument();
  });

  test('affiche les actions admin et déclenche les callbacks', () => {
    const onDelete = jest.fn();
    const onViewDetail = jest.fn();
    render(
      <UserList
        users={USERS}
        isAdmin
        onDelete={onDelete}
        onViewDetail={onViewDetail}
      />
    );

    fireEvent.click(screen.getByTestId('detail-1'));
    fireEvent.click(screen.getByTestId('delete-2'));

    expect(onViewDetail).toHaveBeenCalledWith(1);
    expect(onDelete).toHaveBeenCalledWith(2);
  });
});
