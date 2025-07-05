# Migração para RaceTrack - Documentação das Mudanças

## Resumo das Alterações

Este documento descreve as mudanças implementadas para migrar do sistema antigo de kartódromos (campos de texto) para o novo sistema de RaceTrack (entidade separada com relacionamentos).

## Mudanças no Cache API

### Novas Rotas Adicionadas

1. **GET /cache/raceTracks** - Lista todos os kartódromos
2. **GET /cache/raceTracks/:id** - Busca kartódromo específico
3. **GET /cache/raceTracks/active** - Lista apenas kartódromos ativos

### Novos Métodos no RedisUtils

- `getAllRaceTracks()` - Busca todos os kartódromos
- `getActiveRaceTracks()` - Busca kartódromos ativos
- `getRaceTrackById(id)` - Busca kartódromo por ID

### Atualizações no parseHashData

Adicionados suporte para novos campos:
- `trackLayouts`, `defaultFleets`, `generalInfo` (JSON)
- `isActive` (boolean)
- `createdAt`, `updatedAt` (Date)
- `ballast` (number)

## Mudanças no Frontend

### Novas Interfaces

```typescript
export interface RaceTrack {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  trackLayouts?: any[];
  defaultFleets?: any[];
  generalInfo?: any;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

### Interface Stage Atualizada

```typescript
export interface Stage {
  id: string;
  name: string;
  date: string;
  time: string;
  raceTrackId: string; // Mudou de kartodrome: string
  streamLink?: string;
  briefing?: string;
  seasonId: string;
}
```

### Novos Métodos no ChampionshipService

- `getAllRaceTracks()` - Busca todos os kartódromos
- `getActiveRaceTracks()` - Busca kartódromos ativos
- `getRaceTrackById(id)` - Busca kartódromo específico
- `getRaceTrackDataForStage(raceTrackId)` - Busca dados do kartódromo para uma etapa

### Hook Atualizado

O hook `useChampionships` agora inclui:
- `raceTracks: RaceTrack[]`
- `getRaceTrackById(id)`
- `getActiveRaceTracks()`

### Novo Hook

`useRaceTracks` - Hook dedicado para gerenciar dados de RaceTrack

### Novo Componente

`RaceTrackInfo` - Componente reutilizável para exibir informações de kartódromo

## Componentes Atualizados

### CalendarioTab
- Recebe `raceTracks` como prop
- Usa `RaceTrackInfo` para exibir localização
- Suporte para dados de kartódromo já incluídos no evento

### HomeTab
- Recebe `raceTracks` como prop
- Usa `RaceTrackInfo` para exibir localização
- Suporte para dados de kartódromo já incluídos no evento

### Championship (Página)
- Carrega dados de RaceTrack junto com outros dados
- Passa `raceTracks` para os componentes filhos
- Formata etapas incluindo dados do kartódromo

## Fluxo de Dados

1. **Carregamento**: `useChampionships` carrega todos os dados incluindo RaceTrack
2. **Formatação**: `formatStageForUI` inclui dados do kartódromo quando disponível
3. **Exibição**: Componentes usam `RaceTrackInfo` para exibir informações de localização
4. **Fallback**: Se dados não estiverem disponíveis, exibe informações padrão

## Benefícios da Migração

1. **Normalização**: Dados de kartódromo centralizados e reutilizáveis
2. **Flexibilidade**: Fácil adição de novos campos (endereço, layouts, etc.)
3. **Performance**: Cache otimizado para kartódromos
4. **Manutenibilidade**: Código mais limpo e organizado
5. **Escalabilidade**: Suporte para múltiplos kartódromos por etapa

## Compatibilidade

- Mantém compatibilidade com dados antigos através de fallbacks
- Componentes funcionam mesmo sem dados de RaceTrack
- Migração gradual possível

## Próximos Passos

1. Implementar formulários de criação/edição de etapas com select de kartódromos
2. Adicionar validações para RaceTrack
3. Implementar cache de kartódromos por região
4. Adicionar suporte para múltiplos kartódromos por etapa 