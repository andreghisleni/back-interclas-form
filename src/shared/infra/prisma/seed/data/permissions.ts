export const localPermissions = [
  {
    name: 'users-list',
    label: 'Listar usuários',
    groups: ['admin'],
  },
  {
    name: 'user-update-avatar',
    label: 'Atualizar o avatar do usuário',
    groups: ['default'],
  },
  {
    name: 'user-update-profile',
    label: 'Atualizar o perfil do usuário',
    groups: ['default'],
  },
  {
    name: 'user-list-profile',
    label: 'Listar o perfil do usuário',
    groups: ['default'],
  },
  {
    name: 'user-address-show',
    label: 'Listar o endereço do usuário',
    groups: ['default'],
  },
  {
    name: 'user-address-create',
    label: 'Cadastrar o endereço do usuário',
    groups: ['default'],
  },
  {
    name: 'user-address-update',
    label: 'Atualizar o endereço do usuário',
    groups: ['default'],
  },
  {
    name: 'user-show-permissions',
    label: 'Listar as permissões do usuário',
    groups: ['default'],
  },
  {
    name: 'my-adverts',
    label: 'Listar meus anúncios',
    groups: ['producer'],
  },
  {
    name: 'create-product',
    label: 'Cadastrar um produto',
    groups: ['admin'],
  },
  {
    name: 'find-all-products',
    label: 'Listar todos os produtos',
    groups: ['producer', 'trader', 'admin'],
  },
  {
    name: 'find-all-product-categories',
    label: 'Listar todas as categorias de produtos',
    groups: ['producer', 'trader', 'admin'],
  },
  {
    name: 'create-product-category',
    label: 'Cadastrar uma categoria de produto',
    groups: ['admin'],
  },
  {
    name: 'create-request',
    label: 'Cadastrar uma solicitação',
    groups: ['producer'],
  },
  {
    name: 'find-all-requests',
    label: 'Listar todas as solicitações',
    groups: ['trader', 'admin'],
  },
  {
    name: 'find-all-requests-by-trader',
    label: 'Listar todas as solicitações de um trader',
    groups: ['trader'],
  },
  {
    name: 'find-all-requests-by-owner',
    label: 'Listar todas as solicitações de um produtor',
    groups: ['producer'],
  },
  {
    name: 'finish-request',
    label: 'Finalizar um anuncio',
    groups: ['trader'],
  },
  {
    name: 'find-all-requests-not-finished',
    label: 'Listar todas as solicitações não finalizadas',
    groups: ['trader', 'producer', 'admin'],
  },
];
