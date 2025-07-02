# Triagem SmartCare - Backend

Este repositório contém o backend da aplicação **Triagem SmartCare**, um sistema de triagem médica para facilitar o atendimento e organização de dados de pacientes.

## 🚀 Tecnologias e Ferramentas
- **Node.js** - Plataforma de execução do JavaScript no servidor.
- **Express** - Framework para APIs REST.
- **MongoDB** - Banco de dados NoSQL para armazenamento das triagens e usuários.
- **JWT (JSON Web Tokens)** - Para autenticação e autorização de usuários.
- **bcryptjs** - Para criptografia de senhas.
- **dotenv** - Para gerenciamento de variáveis de ambiente.

## 📦 Instalação e Execução

1. Clone este repositório:
   ```bash
   git clone https://github.com/<seu-usuario>/<seu-repositorio>.git
   cd triagem-backend

   O aplicativo de triagem médica foi desenvolvido para auxiliar profissionais da saúde na coleta inicial de informações clínicas de pacientes, facilitando a priorização no atendimento.

📲 Como usar
Login

Acesse o aplicativo com suas credenciais (usuário e senha).

Caso ainda não tenha cadastro, solicite acesso ao administrador.

Início da Triagem

Clique em "Nova Triagem" para iniciar o processo.

Informe os dados básicos do paciente:

Nome completo

Idade

Gênero

Documento de identificação (opcional)

Preenchimento dos Sintomas

Responda ao questionário clínico com base nas queixas do paciente.

Selecione os sintomas apresentados e sua intensidade.

Informe sinais vitais, se disponíveis (PA, FC, temperatura, etc).

Classificação de Risco

O sistema aplicará regras de prioridade com base nas informações fornecidas.

A cor de classificação (vermelho, laranja, amarelo, verde ou azul) será exibida automaticamente.

Finalização

Revise os dados.

Clique em "Finalizar Triagem" para registrar.

Os dados serão enviados para a fila de atendimento e poderão ser visualizados por profissionais responsáveis.

📁 Histórico
Acesse o menu "Triagens Realizadas" para consultar triagens anteriores.

É possível visualizar detalhes ou atualizar informações, se necessário.

🚨 Observações
A aplicação não substitui o julgamento clínico, apenas oferece apoio à priorização.

O uso adequado depende da veracidade e completude dos dados inseridos.


