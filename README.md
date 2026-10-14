# banco-api-performance

Projeto de testes de performance da API bancária utilizando **JavaScript** e **k6**. O repositório organiza scripts e recursos de apoio para avaliar o comportamento da API sob diferentes condições de carga.

> **Importante:** execute os testes somente em ambientes autorizados e controlados. Testes de carga podem afetar a disponibilidade do serviço.

## 1. Introdução

O objetivo deste projeto é avaliar características não funcionais da API, como tempo de resposta, estabilidade e comportamento durante a execução de requisições concorrentes.

Os cenários são escritos em JavaScript e executados pelo k6. A URL da API sob teste é configurada pela variável de ambiente `BASE_URL`, evitando deixar o endereço do ambiente fixo nos scripts.

Repositório: [laizrocha/banco-api-performance](https://github.com/laizrocha/banco-api-performance)

## 2. Tecnologias utilizadas

- **JavaScript:** linguagem utilizada para implementar os cenários de performance.
- **Grafana k6:** ferramenta de testes de carga e performance, com métricas de execução, verificações (*checks*) e limites de desempenho (*thresholds*).
- **Git e GitHub:** versionamento e hospedagem do projeto.

Documentação oficial:
- [k6 — documentação](https://grafana.com/docs/k6/latest/)
- [JavaScript no k6](https://grafana.com/docs/k6/latest/using-k6/javascript-api/)
- [Variáveis de ambiente no k6](https://grafana.com/docs/k6/latest/using-k6/environment-variables/)
- [Web dashboard e relatório HTML](https://grafana.com/docs/k6/latest/results-output/web-dashboard/)
- [Instalação do k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)

## 3. Estrutura do repositório

```text
banco-api-performance/
├── config/
├── fixtures/
├── helpers/
├── tests/
├── utils/
├── .gitignore
└── README.md
```

### Responsabilidade de cada diretório

| Diretório/arquivo | Objetivo |
| --- | --- |
| `config/` | Reunir configurações reutilizadas pelos cenários, quando aplicável. |
| `fixtures/` | Armazenar dados de apoio usados durante os testes, como entradas e massas de dados. |
| `helpers/` | Concentrar funções auxiliares reutilizáveis pelos scripts de teste. |
| `tests/` | Manter os scripts que definem e executam os cenários de performance. |
| `utils/` | Reunir utilitários compartilhados pelo projeto. |
| `.gitignore` | Definir arquivos e diretórios que não devem ser versionados. |
| `README.md` | Documentar o projeto, sua configuração e sua execução. |

Os arquivos específicos dentro de cada diretório podem variar conforme a evolução do projeto. Consulte o código para identificar os cenários disponíveis e seus parâmetros.

## 4. Instalação e configuração

### Pré-requisitos

1. Instale o [Git](https://git-scm.com/downloads).
2. Instale o [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/).
3. Tenha acesso à API e autorização para executar testes no ambiente escolhido.

Valide a instalação:

```bash
git --version
k6 version
```

### Clonar o repositório

```bash
git clone https://github.com/laizrocha/banco-api-performance.git
cd banco-api-performance
```

### Configurar a variável `BASE_URL`

A variável `BASE_URL` deve conter a URL base do ambiente que será testado. Os scripts k6 acessam variáveis de ambiente por meio de `__ENV`, por exemplo:

```javascript
const baseUrl = __ENV.BASE_URL;
```

Configure a variável antes de executar os testes.

**Windows — PowerShell:**

```powershell
$env:BASE_URL = "https://url-do-ambiente"
```

**Linux/macOS — Bash:**

```bash
export BASE_URL="https://url-do-ambiente"
```

Substitua `https://url-do-ambiente` pela URL real da API autorizada para teste. Se o script utiliza `__ENV.BASE_URL`, não é necessário criar um arquivo `.env`: basta definir a variável no ambiente do processo que executará o k6.

> Não versione credenciais, tokens ou dados sensíveis. Use variáveis de ambiente e ambientes de teste apropriados.

## 5. Execução dos testes

Na raiz do repositório, execute o script desejado:

```bash
k6 run tests/<nome-do-script.js>
```

Substitua `<nome-do-script.js>` pelo caminho e nome de um script existente no diretório `tests/`.

Se preferir informar a URL diretamente no comando, sem configurar a variável previamente:

```bash
k6 run -e BASE_URL="https://url-do-ambiente" tests/<nome-do-script.js>
```

O parâmetro `-e` disponibiliza a variável para o script por meio de `__ENV.BASE_URL`; ele não altera as opções de execução do k6.

Durante a execução, o k6 apresenta no terminal métricas como requisições realizadas, duração das respostas, taxa de falhas e resultados de checks. Os cenários e seus parâmetros — como usuários virtuais, duração e thresholds — devem ser consultados nos scripts.

## 6. Acompanhamento em tempo real e exportação do relatório HTML

O k6 possui um dashboard web que permite acompanhar métricas enquanto o teste está em execução. Também é possível exportar um relatório HTML ao final do teste.

Nos exemplos abaixo, substitua `tests/<nome-do-script.js>` pelo script que deseja executar. Certifique-se de que a variável `BASE_URL` esteja configurada conforme a seção anterior.

### 6.1 Acompanhar a execução em tempo real

**Windows — PowerShell:**

```powershell
$env:K6_WEB_DASHBOARD = "true"
$env:K6_WEB_DASHBOARD_OPEN = "true"
k6 run tests/<nome-do-script.js>
```

**Linux/macOS — Bash:**

```bash
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_OPEN=true \
k6 run tests/<nome-do-script.js>
```

Por padrão, o dashboard fica disponível em `http://localhost:5665`. Mantenha o processo do k6 em execução enquanto acompanha os gráficos.

### 6.2 Exportar o relatório HTML

O relatório pode ser exportado automaticamente ao término da execução usando `K6_WEB_DASHBOARD_EXPORT`.

Crie uma pasta para os relatórios, caso ainda não exista.

**Windows — PowerShell:**

```powershell
New-Item -ItemType Directory -Force reports | Out-Null
$env:K6_WEB_DASHBOARD = "true"
$env:K6_WEB_DASHBOARD_EXPORT = "reports/relatorio-performance.html"
k6 run tests/<nome-do-script.js>
```

**Linux/macOS — Bash:**

```bash
mkdir -p reports
K6_WEB_DASHBOARD=true \
K6_WEB_DASHBOARD_EXPORT=reports/relatorio-performance.html \
k6 run tests/<nome-do-script.js>
```

Ao finalizar o teste, o arquivo `reports/relatorio-performance.html` poderá ser aberto em um navegador e compartilhado como evidência dos resultados. O dashboard e o relatório HTML usam a mesma funcionalidade do k6; a exportação ocorre ao fim da execução.

**Atenção:** o relatório contém gráficos somente quando a duração do teste é suficiente em relação ao período de agregação configurado pelo k6. Para detalhes, consulte a [documentação oficial do dashboard](https://grafana.com/docs/k6/latest/results-output/web-dashboard/).

### 6.3 Exportação sem abrir o dashboard no navegador

Se quiser apenas gerar o HTML, sem abrir automaticamente o dashboard, mantenha `K6_WEB_DASHBOARD=true` e defina `K6_WEB_DASHBOARD_EXPORT`, deixando `K6_WEB_DASHBOARD_OPEN=false` (ou sem configurar essa variável). O relatório será criado ao término da execução.

---

## Boas práticas

- Execute testes de carga somente em ambientes autorizados.
- Comece com cenários pequenos antes de aumentar usuários virtuais e duração.
- Defina `thresholds` coerentes com os requisitos de desempenho do sistema.
- Analise tempo de resposta, percentis, taxa de erros e throughput em conjunto; uma única métrica não conta toda a história.
- Não versione relatórios gerados, credenciais ou dados sensíveis sem avaliar a política do projeto.
