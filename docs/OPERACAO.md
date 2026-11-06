# Operação e diagnóstico

## Slash commands não aparecem

Confira `DISCORD_CLIENT_ID`, `DISCORD_GUILD_ID`, os escopos do convite e se o registro terminou com sucesso. IDs não são tokens. O registro de servidor é preferível durante desenvolvimento. Evite manter a mesma definição em escopos global e de servidor.

## Falta de permissão

`/server` exige **Gerenciar servidor**, tanto na definição quanto no handler. O bot precisa de **Ver canais**, **Enviar mensagens** e **Incorporar links**. Não dê Administrador para contornar um erro de configuração.

## Tarefas demoradas

Responda ou adie a interação primeiro. Não execute consultas longas antes de `deferReply`. O handler usa `followUp` quando a interação já recebeu uma resposta e captura falhas de resposta expirada.

## Docker

Registre os comandos pela máquina de desenvolvimento antes de subir o contêiner. A imagem final contém somente `src/`, dependências de produção e os metadados do pacote.

## Antes de publicar uma alteração

- Rode lint, formatação, testes e smoke test de startup.
- Verifique `git diff --staged` para confirmar que não há segredos ou dados pessoais.
- Confira mudanças de dependências e o lockfile. Não troque versões maiores sem revisar a API.
- Teste com uma conta dedicada e permissões mínimas antes de promover a alteração.
- Use os logs da hospedagem para acompanhar reinícios e consumo real; não há SLA de aplicação nesta base.

## Segredos e logs

As variáveis do painel têm preferência prática sobre arquivos empacotados. Não envie `.env`
para repositórios, imagens Docker ou issues. O logger registra apenas metadados operacionais,
não o conteúdo das conversas. Para investigar um problema, reproduza com dados fictícios e
não habilite logs brutos de SDK em produção.

## Encerramento e reinício

`SIGINT` e `SIGTERM` interrompem conexões e removem listeners. Há um prazo máximo de 10 segundos
para tarefas pendentes. Reinicie o processo após mudar variáveis de ambiente. Verifique a política
de reinício da hospedagem para não transformar erro permanente de credenciais em loop contínuo.

[Voltar ao README](../README.md)
