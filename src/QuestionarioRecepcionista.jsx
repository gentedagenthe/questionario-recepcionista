import React, { useState, useCallback } from 'react';
import { supabase } from './supabaseClient';

const AZUL = '#1B6FAB';
const VERDE = '#6BBF4E';
const FUNDO = '#F0F4F8';
const BORDA = '#D4E6F1';

const styles = {
  page: {
    minHeight: '100vh',
    background: FUNDO,
    fontFamily: "'Poppins', sans-serif",
    padding: '24px 16px',
  },
  header: {
    maxWidth: '640px',
    margin: '0 auto 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: AZUL,
    borderBottom: `4px solid ${VERDE}`,
    borderRadius: '10px',
    padding: '16px 22px',
  },
  logoText: { color: '#fff', fontWeight: 800, fontSize: '20px' },
  logoSub: { color: 'rgba(255,255,255,0.85)', fontSize: '12px' },
  card: {
    maxWidth: '640px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '12px',
    border: `1px solid ${BORDA}`,
    padding: '28px 26px',
    boxShadow: '0 2px 10px rgba(27,111,171,0.08)',
  },
  titulo: { fontSize: '19px', fontWeight: 800, color: AZUL, marginBottom: '4px' },
  subtitulo: { fontSize: '13px', color: '#5b6b7a', marginBottom: '18px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#33404a', margin: '16px 0 6px' },
  input: {
    width: '100%',
    padding: '11px 13px',
    fontSize: '14px',
    borderRadius: '8px',
    border: `1.5px solid ${BORDA}`,
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '11px 13px',
    fontSize: '14px',
    borderRadius: '8px',
    border: `1.5px solid ${BORDA}`,
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  radioGroup: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  radioOpt: (sel) => ({
    padding: '9px 16px',
    borderRadius: '8px',
    border: `1.5px solid ${sel ? VERDE : BORDA}`,
    background: sel ? '#f0faf0' : '#fff',
    fontSize: '13px',
    color: sel ? '#256b1f' : '#33404a',
    cursor: 'pointer',
    fontWeight: sel ? 700 : 500,
  }),
  botao: {
    width: '100%',
    marginTop: '24px',
    padding: '13px',
    background: AZUL,
    color: '#fff',
    fontWeight: 700,
    fontSize: '14px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  botaoSec: {
    width: '100%',
    marginTop: '10px',
    padding: '13px',
    background: '#fff',
    color: AZUL,
    fontWeight: 700,
    fontSize: '14px',
    border: `1.5px solid ${AZUL}`,
    borderRadius: '8px',
    cursor: 'pointer',
  },
  nav: { display: 'flex', gap: '10px', marginTop: '22px' },
  erro: {
    background: '#fff3f3',
    border: '1px solid #f5c2c2',
    color: '#c0392b',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    marginTop: '14px',
  },
  lgpd: {
    background: FUNDO,
    border: `1px solid ${BORDA}`,
    borderRadius: '8px',
    padding: '16px 18px',
    fontSize: '12.5px',
    color: '#4a5a68',
    lineHeight: 1.7,
    marginTop: '14px',
  },
  checkLgpd: (sel) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '13px 15px',
    borderRadius: '8px',
    border: `1.5px solid ${sel ? VERDE : BORDA}`,
    background: sel ? '#f0faf0' : '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#374151',
    marginTop: '18px',
  }),
  progWrap: { display: 'flex', gap: '5px', maxWidth: '640px', margin: '0 auto 14px' },
  progBar: (state) => ({
    flex: 1,
    height: '5px',
    borderRadius: '4px',
    background: state === 'done' ? VERDE : state === 'atual' ? AZUL : BORDA,
  }),
  gridInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '10px',
    margin: '18px 0 22px',
  },
  infoCard: {
    background: FUNDO,
    border: `1px solid ${BORDA}`,
    borderRadius: '10px',
    padding: '14px 12px',
    textAlign: 'center',
  },
  infoIcon: { fontSize: '20px', marginBottom: '4px' },
  infoLabel: { fontSize: '11px', color: '#6b7a88', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' },
  infoValor: { fontSize: '13px', color: '#1a2733', fontWeight: 700, marginTop: '2px' },
  secaoTitulo: {
    fontSize: '12px',
    fontWeight: 800,
    color: AZUL,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginTop: '20px',
    marginBottom: '8px',
  },
  listaItem: { display: 'flex', gap: '8px', fontSize: '13.5px', color: '#3d4a56', padding: '4px 0', lineHeight: 1.5 },
  checkIcon: { color: VERDE, fontWeight: 800 },
  botaoCandidatar: {
    width: '100%',
    marginTop: '22px',
    padding: '14px',
    background: AZUL,
    color: '#fff',
    fontWeight: 700,
    fontSize: '14.5px',
    border: 'none',
    borderRadius: '9px',
    cursor: 'pointer',
  },
};

const ETAPAS = [
  { id: 'lgpd', titulo: '', sub: '' },
  { id: 'dados', titulo: 'Dados Pessoais', sub: 'Preencha seus dados de identificação e contato.' },
  { id: 'situacao', titulo: 'Situação Profissional Atual', sub: 'Conte sua situação atual e disponibilidade.' },
  { id: 'formacao', titulo: 'Formação e Experiência', sub: 'Sua trajetória em atendimento, recepção e serviços de saúde.' },
  { id: 'ferramentas', titulo: 'Sistemas e Tecnologia', sub: 'Sua familiaridade com sistemas, canais digitais e Inteligência Artificial.' },
  { id: 'atendimento', titulo: 'Atendimento e Rotina da Recepção', sub: 'Como você age em situações reais do dia a dia de uma clínica.' },
  { id: 'motivacao', titulo: 'Perfil e Motivação', sub: 'O que te move e o que espera desta oportunidade.' },
  { id: 'localizacao', titulo: 'Localização e Disponibilidade', sub: 'Informações essenciais sobre deslocamento e horário de trabalho.' },
  { id: 'fim', titulo: '', sub: '' },
];

const inicial = {
  // Dados Pessoais
  nome: '', cpf: '', email: '', telefone: '', cidade_atual: '', bairro_atual: '', com_quem_mora: '',
  // Situação Profissional
  situacao_profissional: '', empresa_atual: '', cargo_atual: '', disponibilidade_inicio: '',
  estuda_atualmente: '', turno_estudo: '',
  // Formação e Experiência
  escolaridade: '', cursos_complementares: '', experiencia_recepcao: '',
  experiencia_saude: '', descricao_experiencia_saude: '', experiencia_recebimentos: '', apoio_treinamentos: '',
  // Sistemas e Tecnologia
  nivel_pacote_office: '', sistemas_utilizados: '', atendimento_whatsapp: '', uso_inteligencia_artificial: '',
  aprendizagem_sistemas: '',
  // Atendimento e Rotina da Recepção
  comunicacao_acolhedora: '', agilidade_multicanal: '', organizacao_agenda: '', discricao_sigilo: '',
  responsabilidade_financeira: '', proatividade: '',
  // Perfil e Motivação
  motivacao_vaga: '', contribuicao: '', acordo_remuneracao: '', pretensao_salarial: '',
  // Localização e Disponibilidade
  reside_campo_grande: '', disponibilidade_mudanca: '', meio_transporte: '', tempo_deslocamento: '',
  disponibilidade_horario: '',
  // LGPD
  lgpd_aceite: false,
};


// ---------- Campos definidos FORA do componente para evitar perda de foco ----------

const CampoTexto = React.memo(function CampoTexto({ label, valor, campo, onChange, placeholder, tipo = 'text' }) {
  return (
    <>
      <label style={styles.label}>{label} *</label>
      <input
        style={styles.input}
        type={tipo}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(campo, e.target.value)}
      />
    </>
  );
});

const CampoTextArea = React.memo(function CampoTextArea({ label, valor, campo, onChange, placeholder, linhas = 3 }) {
  return (
    <>
      <label style={styles.label}>{label} *</label>
      <textarea
        style={styles.textarea}
        rows={linhas}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(campo, e.target.value)}
      />
    </>
  );
});

const CampoRadio = React.memo(function CampoRadio({ label, valor, campo, onChange, opcoes }) {
  return (
    <>
      <label style={styles.label}>{label} *</label>
      <div style={styles.radioGroup}>
        {opcoes.map((op) => (
          <div
            key={op}
            style={styles.radioOpt(valor === op)}
            onClick={() => onChange(campo, op)}
          >
            {op}
          </div>
        ))}
      </div>
    </>
  );
});


const Cabecalho = () => (
  <div style={styles.header}>
    <div>
      <div style={styles.logoText}>genthe</div>
      <div style={styles.logoSub}>que entende de gente</div>
    </div>
    <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', textAlign: 'right' }}>
      Processo Seletivo<br />
      <strong style={{ color: '#fff' }}>Recepcionista | Clínica Médica</strong>
    </div>
  </div>
);

const Rodape = () => (
  <div style={{ textAlign: 'center', marginTop: '26px', fontSize: '12px', color: '#8a97a3' }}>
    contato@genthe.com.br &nbsp;|&nbsp; www.genthe.com.br &nbsp;|&nbsp; @gentheconsultoria
  </div>
);

const Item = ({ children }) => (
  <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> {children}</div>
);

export default function QuestionarioRecepcionista() {
  const [tela, setTela] = useState('vaga');
  const [lgpdAceite, setLgpdAceite] = useState(false);
  const [lgpdErro, setLgpdErro] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [form, setForm] = useState(inicial);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const set = useCallback((campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
  }, []);

  const validar = useCallback(() => {
    if (etapa === 1) {
      if (!form.nome.trim()) return 'Informe o nome completo.';
      if (!form.cpf.trim()) return 'Informe o CPF.';
      if (!form.email.trim()) return 'Informe o e-mail.';
      if (!form.telefone.trim()) return 'Informe o telefone.';
      if (!form.cidade_atual.trim()) return 'Informe a cidade onde reside atualmente.';
      if (!form.bairro_atual.trim()) return 'Informe o bairro onde reside atualmente.';
      if (!form.com_quem_mora) return 'Informe com quem mora atualmente.';
    }
    if (etapa === 2) {
      if (!form.situacao_profissional) return 'Informe a situação profissional atual.';
      if (!form.empresa_atual.trim()) return 'Informe a empresa atual ou a mais recente.';
      if (!form.cargo_atual.trim()) return 'Informe o cargo atual ou o mais recente.';
      if (!form.disponibilidade_inicio) return 'Informe a disponibilidade para início.';
      if (!form.estuda_atualmente) return 'Informe se estuda atualmente.';
      if (form.estuda_atualmente === 'Sim' && !form.turno_estudo) return 'Informe o turno dos estudos.';
    }
    if (etapa === 3) {
      if (!form.escolaridade) return 'Informe sua escolaridade.';
      if (!form.cursos_complementares.trim()) return 'Informe seus cursos complementares ou escreva "Nenhum".';
      if (!form.experiencia_recepcao.trim()) return 'Descreva sua experiência com atendimento ao cliente e recepção.';
      if (!form.experiencia_saude) return 'Informe se possui experiência em clínicas, consultórios ou serviços de saúde.';
      if (form.experiencia_saude === 'Sim' && !form.descricao_experiencia_saude.trim()) return 'Descreva sua experiência em serviços de saúde.';
      if (!form.experiencia_recebimentos.trim()) return 'Descreva sua experiência com recebimentos e controles financeiros.';
      if (!form.apoio_treinamentos.trim()) return 'Descreva sua experiência com apoio a treinamentos, reuniões ou eventos.';
    }
    if (etapa === 4) {
      if (!form.nivel_pacote_office) return 'Informe seu nível de conhecimento em Pacote Office.';
      if (!form.sistemas_utilizados.trim()) return 'Informe os sistemas e agendas digitais que já utilizou.';
      if (!form.atendimento_whatsapp.trim()) return 'Descreva sua experiência com atendimento pelo WhatsApp.';
      if (!form.uso_inteligencia_artificial.trim()) return 'Descreva como utiliza ferramentas de Inteligência Artificial.';
      if (!form.aprendizagem_sistemas.trim()) return 'Descreva como aprendeu um sistema ou processo novo.';
    }
    if (etapa === 5) {
      if (!form.comunicacao_acolhedora.trim()) return 'Descreva como conduziria o atendimento ao paciente.';
      if (!form.agilidade_multicanal.trim()) return 'Descreva como organiza o atendimento presencial e digital ao mesmo tempo.';
      if (!form.organizacao_agenda.trim()) return 'Descreva como organiza agenda, confirmações e reagendamentos.';
      if (!form.discricao_sigilo.trim()) return 'Descreva como agiria diante do pedido de informações sobre o paciente.';
      if (!form.responsabilidade_financeira.trim()) return 'Descreva como agiria diante da diferença no fechamento do caixa.';
      if (!form.proatividade.trim()) return 'Descreva uma situação em que agiu com proatividade.';
    }
    if (etapa === 6) {
      if (!form.motivacao_vaga.trim()) return 'Informe o que te motivou a se candidatar.';
      if (!form.contribuicao.trim()) return 'Descreva como pode contribuir com a experiência dos pacientes.';
      if (!form.acordo_remuneracao) return 'Informe se está de acordo com a remuneração oferecida.';
      if (!form.pretensao_salarial.trim()) return 'Informe a pretensão salarial.';
    }
    if (etapa === 7) {
      if (!form.reside_campo_grande) return 'Informe se reside em Campo Grande/MS.';
      if (form.reside_campo_grande === 'Não' && !form.disponibilidade_mudanca) return 'Informe a disponibilidade de mudança.';
      if (!form.meio_transporte) return 'Informe o meio de transporte que utilizaria.';
      if (!form.tempo_deslocamento) return 'Informe o tempo estimado de deslocamento.';
      if (!form.disponibilidade_horario) return 'Informe a disponibilidade para o horário de trabalho.';
    }
    return '';
  }, [etapa, form]);

  const enviar = useCallback(async () => {
    setEnviando(true);
    setErro('');
    try {
      const { error } = await supabase.from('candidatos_recepcionista').insert([{ ...form }]);
      if (error) throw error;
      setTela('fim');
      window.scrollTo(0, 0);
    } catch (e) {
      setErro('Ocorreu um erro ao enviar. Tente novamente em instantes.');
    } finally {
      setEnviando(false);
    }
  }, [form]);

  const avancarLgpd = useCallback(() => {
    if (!lgpdAceite) { setLgpdErro(true); return; }
    setForm((f) => ({ ...f, lgpd_aceite: true }));
    setTela('form');
    window.scrollTo(0, 0);
  }, [lgpdAceite]);

  const avancar = useCallback(() => {
    const msg = validar();
    if (msg) { setErro(msg); return; }
    setErro('');
    if (etapa < ETAPAS.length - 2) {
      setEtapa((e) => e + 1);
      window.scrollTo(0, 0);
    } else {
      enviar();
    }
  }, [etapa, validar, enviar]);

  const voltar = useCallback(() => {
    if (etapa > 1) { setErro(''); setEtapa((e) => e - 1); window.scrollTo(0, 0); }
  }, [etapa]);

  const progresso = () => {
    const total = ETAPAS.length - 2;
    const atualIdx = etapa - 1;
    return (
      <div style={styles.progWrap}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={styles.progBar(i < atualIdx ? 'done' : i === atualIdx ? 'atual' : 'pendente')} />
        ))}
      </div>
    );
  };

  // ---------- Tela da Vaga ----------
  if (tela === 'vaga') {
    return (
      <div style={styles.page}>
        <Cabecalho />
        <div style={{ ...styles.card, maxWidth: '640px' }}>
          <div style={styles.titulo}>Recepcionista</div>
          <div style={styles.subtitulo}>Clínica Médica · Campo Grande/MS (Jardim TV Morena)</div>

          <div style={styles.gridInfo}>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>💰</div>
              <div style={styles.infoLabel}>Salário</div>
              <div style={styles.infoValor}>R$ 1.800,00 bruto</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>🕗</div>
              <div style={styles.infoLabel}>Horário</div>
              <div style={styles.infoValor}>Seg a Sex · Sáb manhã</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📍</div>
              <div style={styles.infoLabel}>Local</div>
              <div style={styles.infoValor}>Jardim TV Morena</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📄</div>
              <div style={styles.infoLabel}>Contratação</div>
              <div style={styles.infoValor}>CLT</div>
            </div>
          </div>

          <div style={styles.secaoTitulo}>🎁 Benefícios</div>
          <div>
            <Item>Vale Transporte</Item>
            <Item>Premiação por desempenho de até R$ 700,00 mensais, conforme metas da clínica</Item>
          </div>

          <div style={styles.secaoTitulo}>🕗 Horário de Trabalho</div>
          <div>
            <Item>Segunda a Sexta, das 08:00 às 12:00 e das 14:00 às 18:00</Item>
            <Item>Sábado, das 08:00 às 12:00</Item>
          </div>

          <div style={styles.secaoTitulo}>📚 Requisitos</div>
          <div>
            <Item>Ensino Médio completo</Item>
            <Item>Atendimento ao cliente e rotinas de recepção</Item>
            <Item>Sistemas, agendas digitais, WhatsApp e Pacote Office</Item>
            <Item>Ferramentas de Inteligência Artificial aplicadas ao trabalho</Item>
            <Item>Desejável experiência em clínicas ou serviços de saúde e com recebimentos</Item>
          </div>

          <div style={styles.secaoTitulo}>🛠️ Principais Atividades</div>
          <div>
            <Item>Recepcionar e atender os pacientes</Item>
            <Item>Organizar a agenda dos profissionais</Item>
            <Item>Agendar, confirmar e reagendar consultas, vacinas e procedimentos</Item>
            <Item>Atender por WhatsApp e canais digitais</Item>
            <Item>Registrar atendimentos no software de gestão e manter cadastros atualizados</Item>
            <Item>Realizar e controlar recebimentos</Item>
            <Item>Orientar pacientes sobre horários, documentos e preparos</Item>
            <Item>Apoiar a organização e a realização de treinamentos da clínica</Item>
            <Item>Usar Inteligência Artificial para apoiar rotinas e comunicação</Item>
          </div>

          <button style={styles.botaoCandidatar} onClick={() => { setTela('lgpd'); window.scrollTo(0, 0); }}>
            Candidate-se agora →
          </button>
        </div>
        <Rodape />
      </div>
    );
  }

  // ---------- Tela LGPD ----------
  if (tela === 'lgpd') {
    return (
      <div style={styles.page}>
        <Cabecalho />
        <div style={{ ...styles.card, maxWidth: '640px' }}>
          <div style={{ fontSize: '30px', marginBottom: '10px' }}>🔒</div>
          <div style={styles.titulo}>Proteção de Dados — LGPD</div>
          <div style={styles.lgpd}>
            As informações fornecidas neste questionário serão utilizadas exclusivamente para fins de recrutamento e seleção pela <strong>Genthe Consultoria em Gestão de Pessoas</strong>, em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD)</strong>.<br /><br />
            Seus dados serão tratados com segurança, sigilo e responsabilidade, podendo ser compartilhados com a empresa contratante vinculada a este processo seletivo. Ao prosseguir, você também autoriza a realização de verificação de antecedentes junto a órgãos públicos, utilizando CPF e nome completo, como parte da etapa de triagem.<br /><br />
            Você poderá solicitar a correção, a atualização ou a exclusão dos seus dados a qualquer momento pelo e-mail <strong>contato@genthe.com.br</strong>. Ao continuar, você declara ter lido e concordado com o tratamento dos seus dados pessoais para participação neste processo seletivo, nos termos da LGPD.
          </div>
          <div style={styles.checkLgpd(lgpdAceite)} onClick={() => { setLgpdAceite((v) => !v); setLgpdErro(false); }}>
            <span style={{ fontSize: '16px' }}>{lgpdAceite ? '✅' : '⬜'}</span>
            Li e concordo com o tratamento dos meus dados pessoais, incluindo a verificação de antecedentes, para participação neste processo seletivo, conforme a LGPD.
          </div>
          {lgpdErro && <div style={styles.erro}>É necessário concordar com os termos para continuar.</div>}
          <button style={styles.botao} onClick={avancarLgpd}>Iniciar questionário →</button>
        </div>
        <Rodape />
      </div>
    );
  }

  // ---------- Tela final ----------
  if (tela === 'fim') {
    return (
      <div style={styles.page}>
        <Cabecalho />
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '38px', marginBottom: '10px' }}>✅</div>
          <div style={styles.titulo}>Questionário enviado com sucesso!</div>
          <div style={{ fontSize: '13px', color: '#5b6b7a', marginTop: '8px' }}>
            Obrigada pela sua participação no processo seletivo. Nossa equipe analisará suas respostas e entrará em contato em breve.
          </div>
        </div>
        <Rodape />
      </div>
    );
  }

  const e = ETAPAS[etapa];

  return (
    <div style={styles.page}>
      <Cabecalho />
      {progresso()}
      <div style={styles.card}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: VERDE, letterSpacing: '0.5px' }}>
          ETAPA {etapa} DE {ETAPAS.length - 2}
        </div>
        <div style={styles.titulo}>{e.titulo}</div>
        <div style={styles.subtitulo}>{e.sub}</div>

        {e.id === 'dados' && (
          <>
            <CampoTexto label="Nome completo" campo="nome" valor={form.nome} onChange={set} placeholder="Seu nome completo" />
            <CampoTexto label="CPF" campo="cpf" valor={form.cpf} onChange={set} placeholder="000.000.000-00" />
            <CampoTexto label="E-mail" campo="email" valor={form.email} onChange={set} placeholder="seuemail@exemplo.com" tipo="email" />
            <CampoTexto label="Telefone (WhatsApp)" campo="telefone" valor={form.telefone} onChange={set} placeholder="(67) 00000-0000" />
            <CampoTexto label="Cidade onde reside atualmente" campo="cidade_atual" valor={form.cidade_atual} onChange={set} placeholder="Sua cidade/UF" />
            <CampoTexto label="Bairro onde reside atualmente" campo="bairro_atual" valor={form.bairro_atual} onChange={set} placeholder="Seu bairro" />
            <CampoRadio
              label="Com quem mora atualmente"
              campo="com_quem_mora"
              valor={form.com_quem_mora}
              onChange={set}
              opcoes={['Sozinho(a)', 'Cônjuge/Companheiro(a)', 'Pais ou responsáveis', 'Outros familiares', 'Outros']}
            />
          </>
        )}

        {e.id === 'situacao' && (
          <>
            <CampoRadio
              label="Situação profissional atual"
              campo="situacao_profissional"
              valor={form.situacao_profissional}
              onChange={set}
              opcoes={['Empregado(a)', 'Trabalhando como autônomo(a)', 'Disponível no mercado']}
            />
            <CampoTexto label="Empresa atual ou mais recente" campo="empresa_atual" valor={form.empresa_atual} onChange={set} placeholder="Nome da empresa" />
            <CampoTexto label="Cargo atual ou mais recente" campo="cargo_atual" valor={form.cargo_atual} onChange={set} placeholder="Seu cargo" />
            <CampoRadio
              label="Disponibilidade para início"
              campo="disponibilidade_inicio"
              valor={form.disponibilidade_inicio}
              onChange={set}
              opcoes={['Imediata', 'Até 15 dias', 'Até 30 dias', 'Acima de 30 dias']}
            />
            <CampoRadio
              label="Você estuda atualmente"
              campo="estuda_atualmente"
              valor={form.estuda_atualmente}
              onChange={set}
              opcoes={['Sim', 'Não']}
            />
            {form.estuda_atualmente === 'Sim' && (
              <CampoRadio
                label="Em qual turno você estuda"
                campo="turno_estudo"
                valor={form.turno_estudo}
                onChange={set}
                opcoes={['Manhã', 'Tarde', 'Noite', 'EAD com horário flexível', 'Sábado']}
              />
            )}
          </>
        )}

        {e.id === 'formacao' && (
          <>
            <CampoRadio
              label="Escolaridade"
              campo="escolaridade"
              valor={form.escolaridade}
              onChange={set}
              opcoes={['Ensino Médio completo', 'Técnico em andamento', 'Técnico completo', 'Superior em andamento', 'Superior completo']}
            />
            <CampoTextArea
              label="Cursos complementares (atendimento, informática, saúde, financeiro ou outros)"
              campo="cursos_complementares"
              valor={form.cursos_complementares}
              onChange={set}
              placeholder="Informe o curso e a instituição. Se não possuir, escreva Nenhum"
              linhas={2}
            />
            <CampoTextArea
              label="Experiência com atendimento ao cliente e rotinas de recepção"
              campo="experiencia_recepcao"
              valor={form.experiencia_recepcao}
              onChange={set}
              placeholder="Descreva onde atuou, por quanto tempo e quais eram suas principais atividades"
            />
            <CampoRadio
              label="Possui experiência em clínicas, consultórios ou serviços de saúde"
              campo="experiencia_saude"
              valor={form.experiencia_saude}
              onChange={set}
              opcoes={['Sim', 'Não']}
            />
            {form.experiencia_saude === 'Sim' && (
              <CampoTextArea
                label="Descreva sua experiência em serviços de saúde"
                campo="descricao_experiencia_saude"
                valor={form.descricao_experiencia_saude}
                onChange={set}
                placeholder="Tipo de clínica ou serviço, tempo de atuação e atividades realizadas"
              />
            )}
            <CampoTextArea
              label="Experiência com recebimentos, caixa ou controles financeiros básicos"
              campo="experiencia_recebimentos"
              valor={form.experiencia_recebimentos}
              onChange={set}
              placeholder="Descreva as atividades que realizava. Se não possuir, explique como aprenderia essa rotina"
            />
            <CampoTextArea
              label="Você já apoiou a organização ou a realização de treinamentos, reuniões ou eventos? Conte como foi sua participação"
              campo="apoio_treinamentos"
              valor={form.apoio_treinamentos}
              onChange={set}
              placeholder="Descreva o que fez: convites, lista de presença, preparação do espaço, materiais, registros"
            />
          </>
        )}

        {e.id === 'ferramentas' && (
          <>
            <CampoRadio
              label="Nível de conhecimento em Pacote Office (Word, Excel e similares)"
              campo="nivel_pacote_office"
              valor={form.nivel_pacote_office}
              onChange={set}
              opcoes={['Básico', 'Intermediário', 'Avançado']}
            />
            <CampoTextArea
              label="Quais sistemas de gestão, agendas digitais ou softwares você já utilizou no trabalho"
              campo="sistemas_utilizados"
              valor={form.sistemas_utilizados}
              onChange={set}
              placeholder="Cite os nomes dos sistemas e para que eram usados"
              linhas={2}
            />
            <CampoTextArea
              label="Como você realiza o atendimento pelo WhatsApp de uma empresa, garantindo agilidade e uma comunicação profissional"
              campo="atendimento_whatsapp"
              valor={form.atendimento_whatsapp}
              onChange={set}
              placeholder="Descreva sua forma de atender, organizar as conversas e dar retorno"
            />
            <CampoTextArea
              label="Você utiliza ferramentas de Inteligência Artificial (como ChatGPT, Gemini ou Claude)? Dê um exemplo de como usa ou usaria no trabalho"
              campo="uso_inteligencia_artificial"
              valor={form.uso_inteligencia_artificial}
              onChange={set}
              placeholder="Conte um exemplo prático"
            />
            <CampoTextArea
              label="Conte uma situação em que precisou aprender um sistema ou processo novo. Como você fez"
              campo="aprendizagem_sistemas"
              valor={form.aprendizagem_sistemas}
              onChange={set}
              placeholder="Descreva o contexto, como aprendeu e o resultado"
            />
          </>
        )}

        {e.id === 'atendimento' && (
          <>
            <CampoTextArea
              label="Um paciente chega à recepção ansioso e irritado porque a consulta está atrasada. Como você conduz esse atendimento"
              campo="comunicacao_acolhedora"
              valor={form.comunicacao_acolhedora}
              onChange={set}
              placeholder="Descreva o que diria e como agiria"
            />
            <CampoTextArea
              label="Há pacientes aguardando na recepção e, ao mesmo tempo, várias mensagens chegam pelo WhatsApp pedindo agendamento. Como você organiza esse atendimento"
              campo="agilidade_multicanal"
              valor={form.agilidade_multicanal}
              onChange={set}
              placeholder="Descreva como define prioridades sem deixar ninguém sem retorno"
            />
            <CampoTextArea
              label="Como você organiza a agenda, as confirmações e os reagendamentos para evitar erros, faltas e conflitos de horário"
              campo="organizacao_agenda"
              valor={form.organizacao_agenda}
              onChange={set}
              placeholder="Descreva seu método de organização"
            />
            <CampoTextArea
              label="Uma pessoa liga dizendo ser familiar de um paciente e pede informações sobre a consulta e os exames dele. Como você age"
              campo="discricao_sigilo"
              valor={form.discricao_sigilo}
              onChange={set}
              placeholder="Descreva sua conduta"
            />
            <CampoTextArea
              label="Ao fechar o caixa do dia, você percebe uma diferença entre os recebimentos registrados e o valor disponível. O que você faz"
              campo="responsabilidade_financeira"
              valor={form.responsabilidade_financeira}
              onChange={set}
              placeholder="Descreva os passos que seguiria"
            />
            <CampoTextArea
              label="Descreva uma situação em que você identificou um problema na rotina de trabalho e resolveu ou propôs uma solução sem esperar cobrança"
              campo="proatividade"
              valor={form.proatividade}
              onChange={set}
              placeholder="Conte o contexto, a ação e o resultado"
            />
          </>
        )}

        {e.id === 'motivacao' && (
          <>
            <CampoTextArea
              label="O que te motivou a se candidatar a esta vaga"
              campo="motivacao_vaga"
              valor={form.motivacao_vaga}
              onChange={set}
              placeholder="Seja objetivo"
            />
            <CampoTextArea
              label="De que forma você pode contribuir para que os pacientes tenham uma experiência organizada, ágil e acolhedora na clínica"
              campo="contribuicao"
              valor={form.contribuicao}
              onChange={set}
              placeholder="Descreva sua contribuição esperada"
            />
            <CampoRadio
              label="A vaga oferece salário de R$ 1.800,00 bruto, Vale Transporte e premiação por desempenho de até R$ 700,00 mensais, conforme metas. Você está de acordo com essa remuneração"
              campo="acordo_remuneracao"
              valor={form.acordo_remuneracao}
              onChange={set}
              opcoes={['Sim', 'Não']}
            />
            <CampoTexto label="Pretensão salarial" campo="pretensao_salarial" valor={form.pretensao_salarial} onChange={set} placeholder="R$ 0,00" />
          </>
        )}

        {e.id === 'localizacao' && (
          <>
            <div style={styles.lgpd}>
              A clínica está localizada no bairro Jardim TV Morena, em Campo Grande/MS. O horário de trabalho é de segunda a sexta, das 08:00 às 12:00 e das 14:00 às 18:00, e aos sábados, das 08:00 às 12:00.
            </div>
            <CampoRadio
              label="Você reside atualmente em Campo Grande/MS"
              campo="reside_campo_grande"
              valor={form.reside_campo_grande}
              onChange={set}
              opcoes={['Sim', 'Não']}
            />
            {form.reside_campo_grande === 'Não' && (
              <CampoRadio
                label="Você tem disponibilidade de mudança para Campo Grande/MS"
                campo="disponibilidade_mudanca"
                valor={form.disponibilidade_mudanca}
                onChange={set}
                opcoes={['Sim', 'Não']}
              />
            )}
            <CampoRadio
              label="Qual meio de transporte você utilizaria para chegar à clínica"
              campo="meio_transporte"
              valor={form.meio_transporte}
              onChange={set}
              opcoes={['Ônibus', 'Carro', 'Moto', 'Bicicleta', 'A pé', 'Outro']}
            />
            <CampoRadio
              label="Tempo estimado de deslocamento até o bairro Jardim TV Morena"
              campo="tempo_deslocamento"
              valor={form.tempo_deslocamento}
              onChange={set}
              opcoes={['Até 20 minutos', 'De 20 a 40 minutos', 'De 40 minutos a 1 hora', 'Mais de 1 hora']}
            />
            <CampoRadio
              label="Você tem disponibilidade para cumprir o horário de segunda a sexta, em dois turnos, e aos sábados pela manhã"
              campo="disponibilidade_horario"
              valor={form.disponibilidade_horario}
              onChange={set}
              opcoes={['Sim', 'Não']}
            />
          </>
        )}

        {erro && <div style={styles.erro}>{erro}</div>}

        <div style={styles.nav}>
          {etapa > 1 && <button style={styles.botaoSec} onClick={voltar}>← Voltar</button>}
          <button style={styles.botao} onClick={avancar} disabled={enviando}>
            {etapa === ETAPAS.length - 2 ? (enviando ? 'Enviando...' : '✅ Enviar questionário') : 'Continuar →'}
          </button>
        </div>
      </div>
      <Rodape />
    </div>
  );
}
