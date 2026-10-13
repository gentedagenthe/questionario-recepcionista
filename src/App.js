import React from 'react';
import QuestionarioRecepcionista from './QuestionarioRecepcionista';
import AdminPanel from './components/AdminPanel';

const encerrado = process.env.REACT_APP_INSCRICOES_ENCERRADAS === 'true';

function InscricoesEncerradas() {
  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: "'Poppins', sans-serif", padding: '24px 16px' }}>
      <div style={{ maxWidth: '640px', margin: '60px auto 0', background: '#fff', borderRadius: '12px', border: '1px solid #D4E6F1', padding: '32px 26px', textAlign: 'center' }}>
        <div style={{ fontSize: '34px', marginBottom: '10px' }}>📋</div>
        <div style={{ fontSize: '19px', fontWeight: 800, color: '#1B6FAB' }}>Inscrições encerradas</div>
        <div style={{ fontSize: '13px', color: '#5b6b7a', marginTop: '8px' }}>
          O prazo de inscrição para a vaga de Recepcionista foi encerrado. Agradecemos o seu interesse. Acompanhe novas oportunidades em @gentheconsultoria.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const rota = window.location.pathname;

  if (rota.startsWith('/admin')) {
    return <AdminPanel />;
  }

  if (encerrado) {
    return <InscricoesEncerradas />;
  }

  return <QuestionarioRecepcionista />;
}
