# Identidade visual do Bombadão

**Versão:** 1.0  
**Data:** 5 de novembro de 2026  
**Uso:** referência de design para o produto, a landing page e futuras telas

## Para que serve este guia

Este documento registra a linguagem visual aprovada para o Bombadão. Novas páginas, componentes e materiais devem partir destas decisões e evoluí-las com intenção. A identidade deve fazer o produto parecer pensado para quem treina, sem cair em clichês de academia ou em layouts genéricos de SaaS.

## Ideia central da marca

Bombadão ajuda a pessoa a organizar o treino, registrar o que realmente fez e perceber sua evolução. A interface deve transmitir energia e clareza, respeitando a individualidade e o ritmo de cada pessoa.

### Princípios

- **Força com clareza:** a interface tem presença, mas as ações e informações continuam fáceis de encontrar.
- **Progresso concreto:** priorizar séries, carga, repetições, frequência, recordes e medidas que a pessoa registrou.
- **Autonomia:** a pessoa controla seu plano e decide o que compartilhar.
- **Energia sem exagero:** usar cor e movimento para orientar a atenção, não para competir com o conteúdo.
- **Produto em primeiro lugar:** mostrar como o Bombadão funciona por meio de telas, dados e interações próprias.

## Direção visual

A linguagem combina composição editorial com precisão de uma ferramenta de treino. Usar títulos grandes e compactos, alinhamentos assimétricos com propósito, áreas de respiro e detalhes gráficos inspirados em anotações e marcações de treino.

O resultado deve ser contemporâneo e tátil, com microinterações discretas. A referência “Apple Style” significa cuidado com hierarquia, espaçamento, transições e acabamento; não significa reproduzir páginas, ícones ou componentes da Apple.

### Direção do painel do usuário

O painel é um app de consumo para pessoas comuns que treinam, não um sistema de gestão para empresas. Sua referência de uso são apps cotidianos que as pessoas já entendem, como iFood, Instagram e WhatsApp. Usar esses produtos como referência de familiaridade e facilidade; não copiar suas marcas, cores, ícones ou telas.

- Começar pelo celular e colocar a próxima ação importante em evidência, como iniciar o treino ou continuar uma sessão.
- Usar navegação curta e familiar, com início, treinos, histórico, evolução, medidas e perfil. Em telas móveis, priorizar uma barra de navegação inferior.
- Falar com a pessoa de forma natural e acolhedora: “Oi, Ana”, “Bora treinar?” e “Seus últimos treinos” funcionam melhor que rótulos de painel administrativo.
- Preferir cartões claros, cantos mais arredondados, alvos de toque confortáveis e estados visuais fáceis de perceber.
- Deixar detalhes técnicos, códigos e etiquetas em segundo plano. Evitar excesso de caixa alta, jargão e siglas.
- Celebrar consistência e esforço sem pressionar a pessoa, criar culpa ou comparar corpos.
- O painel pode ser mais caloroso e prático que a landing page. A landing mantém o ritmo editorial da marca; o painel coloca tarefas e dados pessoais em primeiro lugar.

## Paleta de cores

| Token | Cor | Hex | Uso |
|---|---|---|---|
| `--paper` | Papel mineral | `#ECECDF` | Fundo principal e áreas amplas |
| `--paper-light` | Papel claro | `#F7F7EF` | Cartões, superfícies e rodapé |
| `--ink` | Tinta escura | `#181A15` | Texto principal, navegação e fundos de alto contraste |
| `--ink-soft` | Tinta suave | `#242820` | Superfícies escuras secundárias |
| `--lime` | Lima elétrica | `#D7FF45` | Ação principal, progresso e pequenos destaques |
| `--green` | Verde oliva | `#607E27` | Cor de apoio, links e elementos de progresso |
| `--muted` | Cinza oliva | `#72766C` | Texto secundário e metadados |

### Regras de cor

- Reservar o lima para ações, estados ativos e pequenos focos de atenção.
- Usar tinta escura sobre lima; evitar texto lima sobre papel claro.
- Confirmar contraste de texto e controles em cada nova combinação.
- As cores não devem ser o único sinal de estado: combinar cor com texto, forma ou ícone.
- Fundos escuros podem criar pausa e contraste entre seções, sem transformar toda a experiência em modo escuro.

## Tipografia

| Função | Família | Aplicação |
|---|---|---|
| Títulos de impacto na landing page | Oswald, pesos 500 a 700 | Chamadas editoriais e aberturas de seção |
| Texto e interface | Manrope, pesos 400 a 800 | Navegação, conteúdo, botões e interface do painel |
| Metadados | DM Mono, pesos 400 e 500 | Horários, séries, numeração e medidas quando a forma monoespaçada ajudar a comparar |

Os arquivos atuais carregam essas fontes pelo Google Fonts e declaram alternativas locais no CSS. Se as fontes remotas não estiverem disponíveis, a página deve continuar legível e bem composta usando as famílias substitutas. Não usar fontes decorativas em parágrafos longos.

### Hierarquia

- Títulos editoriais da landing page podem usar caixa alta e entrelinha curta.
- Títulos do painel devem usar Manrope, caixa normal, frases curtas e uma hierarquia acolhedora.
- Parágrafos com largura confortável e entrelinha generosa.
- Metadados compactos, sempre com contraste suficiente.
- Evitar usar caixa alta em textos longos ou instruções importantes.

## Composição e componentes

- Projetar primeiro para o celular e ampliar a composição para telas maiores.
- Usar margens confortáveis, divisões discretas e grades simples.
- Alternar áreas claras e escuras para organizar o ritmo da página.
- Usar cartões com cantos arredondados e superfícies claras no painel; reservar círculos para avatares, indicadores e gráficos.
- Botões de ação devem ter rótulos diretos, área de toque confortável e uma resposta visual curta.
- Exibir dados como séries, carga e repetições em linhas fáceis de comparar.
- Tabelas, cartões e gráficos devem favorecer leitura rápida durante o treino.
- Informações de demonstração devem ser identificadas como ilustrativas até usarem dados reais.

## Linguagem gráfica

Os visuais devem explicar uma função ou uma ideia do produto. A landing page usa prévias de interface desenhadas com HTML, CSS e SVG, gráficos simples, marcações circulares e motivos de movimento.

### Preferir

- Componentes que pareçam telas reais do Bombadão.
- Gráficos claros e rotulados, com unidades e intervalos quando houver dados reais.
- Ilustrações vetoriais próprias e pequenas marcações inspiradas em fichas de treino.
- Texturas leves, linhas e padrões pontuais que não prejudiquem o texto.

### Evitar

- Fotos genéricas de academia usadas só para preencher espaço.
- Silhuetas, halteres cromados ou raios como atalho visual para “fitness”.
- Gradientes decorativos sem função, brilho excessivo e sombras pesadas.
- Placeholders apresentados como métricas reais, depoimentos ou resultados garantidos.
- Ilustrações genéricas com aparência de template de inteligência artificial.

## Movimento e microinterações

Movimento deve orientar, confirmar e dar profundidade. Usar transições suaves, com duração geralmente entre 180 e 600 ms. Animações de entrada podem ser mais longas quando a mudança de página ou rolagem justificar.

### Interações aprovadas como direção

- Revelar blocos com leve deslocamento e redução de desfoque ao entrarem na área visível.
- Dar profundidade discreta à prévia de treino e aos cartões em dispositivos com cursor.
- Mostrar resposta de hover e pressionamento em botões, links, linhas e cartões.
- Usar uma barra fina para indicar o avanço na leitura de páginas longas.
- Animar traçados de gráficos quando isso ajuda a acompanhar a linha de evolução.
- Expandir perguntas frequentes com transições curtas e um indicador claro de abertura.

### Limites de movimento

- Evitar animações contínuas que desviem a atenção do treino ou dos dados.
- Não usar cursor personalizado, partículas, confete ou parallax intenso como decoração padrão.
- Evitar deslocar controles enquanto a pessoa tenta tocar neles.
- Respeitar `prefers-reduced-motion`; todo conteúdo deve permanecer disponível sem animação.
- Em telas sensíveis ao toque, simplificar ou remover inclinação e efeitos dependentes de cursor.
- Garantir foco visível e funcionamento por teclado em menus, botões e elementos expansíveis.

## Voz e conteúdo visual

O tom é direto, próximo e confiante, com linguagem cotidiana. O produto fala sobre organização, consistência e evolução sem humilhar, comparar corpos ou prometer resultados físicos.

- Preferir “registre seu treino” a slogans vagos.
- Usar “evolução” como histórico observável, sem garantir que a carga sempre subirá.
- Tratar a IA como apoio para criar uma proposta, não como autoridade clínica.
- Informar quando telas, métricas ou recursos forem conceituais ou ainda estiverem em desenvolvimento.
- Deixar claro que a pessoa decide o que compartilhar.

## Responsividade e acessibilidade

- A experiência prioritária é móvel; as ações de registrar série precisam ser fáceis de usar com uma mão.
- Garantir hierarquia responsiva sem rolagem horizontal para o conteúdo principal.
- Manter foco de teclado visível e ordem de navegação coerente.
- Usar HTML semântico, rótulos acessíveis e textos alternativos para imagens informativas.
- Preservar conteúdo e função quando animações ou fontes remotas estiverem indisponíveis.
- Verificar contraste, tamanho de toque, zoom e leitura em telas estreitas antes de publicar.

## Aplicação atual

A primeira landing page do Bombadão está em `landing/`:

- `index.html` contém conteúdo, navegação e estrutura semântica.
- `styles.css` contém a paleta, tipografia, layout, responsividade e microinterações.
- `app.js` controla o menu móvel, a barra de leitura, as entradas por rolagem e os movimentos dependentes do cursor.

Os recursos descritos na landing page são a proposta do produto em desenvolvimento. A página não representa integração pronta com autenticação, IA, registro de treino ou cobrança.

## Como manter este guia

Atualizar este documento quando uma decisão visual mudar de forma consistente, como a paleta, a tipografia, o nível de movimento ou o tratamento de dados e privacidade. Para novas telas, reutilizar os tokens e padrões existentes; criar uma exceção apenas quando ela resolver uma necessidade concreta do produto.
