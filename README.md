# Anti-Chatice

Extensão para Chrome que oculta conteúdo indesejado em sites, promovendo navegação limpa e focada em produtividade.

## Funcionalidades

- Oculta elementos por classe CSS (ex: BIG_BROTHER_BRASIL, entretenimento)
- Oculta links por conteúdo do href (ex: bbb, revistaquem, pcc)
- Oculta links por texto (ex: Yasmin Brunet, Virginia Fonseca, Zé Felipe)
- Oculta elementos por atributo (ex: data-tracking-action="entretenimento", data-area="splash")
- Monitora mudanças dinâmicas na página

## Instalação

1. Baixe ou clone o repositório
2. Abra `chrome://extensions/` no Chrome
3. Ative o "Modo desenvolvedor"
4. Clique em "Carregar sem compactação"
5. Selecione a pasta do projeto

## Configuração

Edite `config.js` para adicionar/remover regras de ocultação:

```javascript
const hideRules = [
  { type: 'class', value: 'CLASSE_A_OCULTAR' },
  { type: 'href', value: 'PALAVRA_NO_HREF' },
  // Adicione mais regras conforme necessário
]
```

## Uso

A extensão funciona automaticamente em todas as páginas. Para desativar temporariamente, desative a extensão nas configurações do Chrome.

## Desenvolvimento

- Código limpo e SOLID
- Configurado com ESLint (Standard)
- Testes com Jest (planejado)

## Licença

MIT