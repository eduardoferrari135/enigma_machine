# Máquina Enigma - Simulador Interativo

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Uma simulação interativa e educacional completa da lendária **Máquina Enigma**, o dispositivo de criptografia usado pela Alemanha nazista durante a Segunda Guerra Mundial. Este projeto recria fielmente o funcionamento mecânico e visual da máquina, permitindo que usuários modernos experimentem e compreendam como a criptografia funcionava na era pré-digital.

## 📖 Sobre a Máquina Enigma

A Máquina Enigma foi uma das primeiras ferramentas de criptografia eletromecânica, desenvolvida na década de 1920 e amplamente usada durante a Segunda Guerra Mundial. Sua complexidade veio da combinação de:

- **3 rotores giratórios** com fiações elétricas únicas
- **Plugboard** para conexões adicionais
- **Refletor** para completar o circuito elétrico
- **Mecanismo de avanço** automático dos rotores

A quebra do código Enigma pelos Aliados, liderada por Alan Turing e sua equipe em Bletchley Park, é considerada um dos feitos mais importantes da história da computação e da guerra.

## 🎯 Funcionalidades

### Interface Autêntica
- **Design visual fiel** à máquina original alemã
- **Replicação física**: case de madeira, placa metálica, lâmpadas, teclado
- **Animações realistas** de rotores girando e lâmpadas acendendo

### Configuração Completa
- **Seleção de rotores**: I, II, III, IV, V (históricos)
- **Posicionamento inicial** dos rotores (A-Z)
- **Plugboard interativo** para conexões manuais
- **Refletores**: B e C (modelos históricos)
- **Controles visuais** de configuração

### Funcionalidades Educacionais
- **Criptografia em tempo real** - veja o texto sendo cifrado letra por letra
- **Fitas de entrada/saída** mostrando texto plano e cifrado
- **Indicadores visuais** dos rotores girando
- **Reset e reconfiguração** instantânea

### Interação Versátil
- **Teclado virtual** com feedback visual
- **Suporte ao teclado físico** (letras A-Z)
- **Interface responsiva** para desktop e dispositivos móveis

## 🚀 Como Usar

### Configuração Inicial

1. **Escolha os rotores**: Selecione três rotores diferentes (I, II, III, IV, V)
2. **Defina posições iniciais**: Configure a posição de cada rotor (A-Z)
3. **Selecione o refletor**: Escolha entre refletor B ou C
4. **Configure o plugboard** (opcional): Clique em duas letras para conectá-las

### Criptografia

1. **Digite texto**: Use o teclado virtual ou pressione letras no teclado físico
2. **Observe o processo**: Veja os rotores girando e lâmpadas acendendo
3. **Leia o resultado**: O texto cifrado aparece na fita inferior
4. **Continue digitando**: Cada letra avança o mecanismo automaticamente

### Reconfiguração

- Clique no botão **CONFIG** para abrir as configurações
- Use o botão **Reset** para retornar à configuração inicial
- Todas as mudanças são aplicadas instantaneamente

## 🛠️ Tecnologias Utilizadas

- **React 19.2.0** - Framework moderno para interfaces
- **TypeScript 5.9.3** - Tipagem estática para código robusto
- **Vite 7.2.4** - Build tool rápido e moderno
- **Lucide React** - Ícones modernos e consistentes
- **CSS3** - Estilização avançada com gradientes e animações

## 📁 Estrutura do Projeto

```
enigma-machine/
├── enigma-project/          # Aplicação principal
│   ├── public/             # Assets estáticos
│   ├── src/
│   │   ├── enigma/         # Lógica da máquina Enigma
│   │   │   ├── enigma-core.ts      # Implementação da máquina
│   │   │   ├── EnigmaSimulator.tsx # Componente React principal
│   │   │   └── EnigmaSimulator.css  # Estilos da interface
│   │   ├── App.tsx         # Componente raiz
│   │   └── main.tsx        # Ponto de entrada
│   ├── package.json        # Dependências e scripts
│   └── vite.config.ts      # Configuração do Vite
└── README.md              # Este arquivo
```

## 🏃‍♂️ Execução Local

### Pré-requisitos

- **Node.js** 18+ instalado
- **npm** ou **yarn** como gerenciador de pacotes

### Instalação e Execução

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/enigma-machine.git
   cd enigma-machine
   ```

2. **Instale as dependências**:
   ```bash
   cd enigma-project
   npm install
   ```

3. **Execute o projeto**:
   ```bash
   npm run dev
   ```

4. **Abra no navegador**:
   - Acesse `http://localhost:5173`
   - Comece a experimentar com a máquina!

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa análise de código

## 🎓 Aspectos Educacionais

Este simulador serve como ferramenta educacional para:

### História da Computação
- **Entender criptografia clássica** e seus princípios
- **Conhecer o contexto histórico** da Segunda Guerra Mundial
- **Valorizar conquistas computacionais** pioneiras

### Conceitos Técnicos
- **Algoritmos de substituição** e permutação
- **Mecânica de rotores** e avanço automático
- **Importância da configuração inicial** (chave)
- **Vulnerabilidades de sistemas** de criptografia

### Matemática Aplicada
- **Teoria dos grupos** e álgebra modular
- **Probabilidade** e análise de frequência
- **Combinações possíveis** (10^114 possibilidades teóricas)

## 🔧 Arquitetura Técnica

### Componentes Principais

#### EnigmaMachine Class
Implementação completa da lógica da máquina:
- **Rotors**: 3 rotores com fiações históricas
- **Reflector**: Reflexão do sinal elétrico
- **Plugboard**: Conexões manuais adicionais
- **Step Mechanism**: Avanço automático dos rotores

#### EnigmaSimulator Component
Interface React interativa:
- **Estado complexo** gerenciando configuração e operação
- **Event handlers** para teclado virtual e físico
- **Animações CSS** para feedback visual
- **Configurações modais** para personalização

#### MachineLibrary
Banco de dados das configurações históricas:
- **5 rotores originais** (I-V) com suas fiações
- **2 refletores** (B e C)
- **Especificações técnicas** autênticas

## 🤝 Contribuição

Contribuições são bem-vindas! Este projeto tem foco educacional e histórico.

### Como Contribuir

1. **Fork** o projeto
2. **Crie uma branch** para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit suas mudanças** (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push para a branch** (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request**

### Ideias para Contribuições

- **Recursos históricos**: Adicionar mais refletores ou configurações
- **Modo educativo**: Guias passo-a-passo e explicações
- **Animações**: Visualização do fluxo elétrico na máquina
- **Testes**: Conjunto de testes para validar implementações
- **Acessibilidade**: Melhor suporte para leitores de tela
- **Internacionalização**: Suporte para outros idiomas

## 📚 Referências e Fontes

- **"The Enigma Cipher Machine"** - Documentação técnica original
- **Bletchley Park Archives** - Registros históricos da quebra do código
- **Cryptography Engineering** - Livro de Niels Ferguson
- **The Imitation Game** - Representação cinematográfica (inspiracional)

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Nota**: Este simulador é uma ferramenta educacional e não deve ser usado para criptografia real. A segurança moderna requer algoritmos muito mais sofisticados que os apresentados aqui.

