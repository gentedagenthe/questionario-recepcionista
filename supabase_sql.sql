create table candidatos_recepcionista (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamp with time zone default now(),

  -- Dados Pessoais
  nome text not null,
  cpf text not null,
  email text not null,
  telefone text not null,
  cidade_atual text not null,
  bairro_atual text not null,
  com_quem_mora text not null,

  -- Situação Profissional
  situacao_profissional text not null,
  empresa_atual text not null,
  cargo_atual text not null,
  disponibilidade_inicio text not null,
  estuda_atualmente text not null,
  turno_estudo text,

  -- Formação e Experiência
  escolaridade text not null,
  cursos_complementares text not null,
  experiencia_recepcao text not null,
  experiencia_saude text not null,
  descricao_experiencia_saude text,
  experiencia_recebimentos text not null,
  apoio_treinamentos text not null,

  -- Sistemas e Tecnologia
  nivel_pacote_office text not null,
  sistemas_utilizados text not null,
  atendimento_whatsapp text not null,
  uso_inteligencia_artificial text not null,
  aprendizagem_sistemas text not null,

  -- Atendimento e Rotina da Recepção
  comunicacao_acolhedora text not null,
  agilidade_multicanal text not null,
  organizacao_agenda text not null,
  discricao_sigilo text not null,
  responsabilidade_financeira text not null,
  proatividade text not null,

  -- Perfil e Motivação
  motivacao_vaga text not null,
  contribuicao text not null,
  acordo_remuneracao text not null,
  pretensao_salarial text not null,

  -- Localização e Disponibilidade
  reside_campo_grande text not null,
  disponibilidade_mudanca text,
  meio_transporte text not null,
  tempo_deslocamento text not null,
  disponibilidade_horario text not null,

  -- LGPD
  lgpd_aceite boolean not null default false
);

alter table candidatos_recepcionista enable row level security;

create policy "Permitir insercao publica"
  on candidatos_recepcionista
  for insert
  to anon
  with check (true);

create policy "Permitir leitura pelo painel"
  on candidatos_recepcionista
  for select
  to anon
  using (true);

notify pgrst, 'reload schema';
