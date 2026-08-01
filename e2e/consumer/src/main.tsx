import { createRoot } from 'react-dom/client';
import { StrictMode, useState } from 'react';
import {
  createSortableTreeGlobalStyles,
  moveItemAfter,
  moveItemBefore,
  moveItemInside,
  moveItemsAfter,
  moveItemsBefore,
  moveItemsInside,
  removeItemById,
  removeItemsById,
  setTreeItemProperties,
  SortableTree,
  TreeItemStructure,
  type DropResult,
  type MoveTreeItemResult,
  type MoveTreeItemsResult,
  type RenderItemProps,
  type SortableTreeDragActivationConstraints,
  type TreeItem,
  type TreeItems,
} from '@clevertask/react-sortable-tree';
type CustomTreeItem = TreeItem<{
  icon?: string;
  description?: string;
}>;
type MyTreeItem = TreeItems<CustomTreeItem>;
type LastMoveResult = DropResult<CustomTreeItem> | DropResult<CustomTreeItem>[];
type ProgrammaticMoveResult =
  | MoveTreeItemResult<CustomTreeItem>
  | MoveTreeItemsResult<CustomTreeItem>;

const BASE_TREE: MyTreeItem = [
  { id: 'a', label: 'A', parentId: null },
  { id: 'z', label: 'Z', parentId: 'a' },
  { id: 'b', label: 'B', parentId: null },
  { id: 'b1', label: 'B1', parentId: 'b' },
  { id: 'c', label: 'C', parentId: null },
  { id: 'd', label: 'D', parentId: null },
  { id: 'e', label: 'E', parentId: null },
];

const DEMO_DRAG_ACTIVATION_CONSTRAINTS = {
  mouse: { distance: 6 },
  touch: { delay: 220, tolerance: 8 },
  pen: { distance: 6 },
} satisfies SortableTreeDragActivationConstraints;

const renderConsumerDragHandle = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    style={{ fill: '#919eab', flex: '0 0 auto', margin: 'auto', overflow: 'visible' }}
    viewBox="0 0 20 20"
    width="12"
  >
    <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
  </svg>
);

const App = () => {
  const [treeItems, setTreeItems] = useState<MyTreeItem>(BASE_TREE);
  const [lastMoveResult, setLastMoveResult] = useState<LastMoveResult>(null);
  const [useDragActivationConstraints, setUseDragActivationConstraints] = useState(false);
  const [dragDisabled, setDragDisabled] = useState(false);

  const runProgrammaticMove = (moveFn: (items: MyTreeItem) => ProgrammaticMoveResult) => {
    setTreeItems((currentItems) => {
      const moveResult = moveFn(currentItems);

      if ('results' in moveResult) {
        setLastMoveResult(moveResult.results);
      } else {
        setLastMoveResult(moveResult.result);
      }

      return moveResult.items;
    });
  };

  const runProgrammaticRemove = (removeFn: (items: MyTreeItem) => MyTreeItem) => {
    setTreeItems((currentItems) => {
      const nextItems = removeFn(currentItems);
      setLastMoveResult(null);
      return nextItems;
    });
  };

  const MyCustomTreeItem = (props: RenderItemProps<CustomTreeItem>) => {
    const useSortableTreeGlobalStyles = createSortableTreeGlobalStyles({
      indicatorColor: 'red',
      indicatorBorderColor: 'red',
    });

    useSortableTreeGlobalStyles();

    return (
      <TreeItemStructure
        {...props}
        draggableItemStyle={{ background: 'violet', display: 'flex', border: '1px solid yellow' }}
      >
        {props.dragDisabled ? null : (
          <TreeItemStructure.DragHandler
            as="button"
            style={{
              appearance: 'none',
              background: 'transparent',
              border: 0,
              cursor: 'grab',
              display: 'flex',
              flex: '0 0 auto',
              padding: 15,
              touchAction: 'none',
              width: 12,
            }}
          >
            {renderConsumerDragHandle()}
          </TreeItemStructure.DragHandler>
        )}

        <p data-tree-item-label>{props.treeItem.label}</p>
      </TreeItemStructure>
    );
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => runProgrammaticMove((items) => moveItemAfter(items, 'b1', 'z'))}>
          Move B1 after Z
        </button>
        <button onClick={() => runProgrammaticMove((items) => moveItemBefore(items, 'd', 'b'))}>
          Move D before B
        </button>
        <button onClick={() => runProgrammaticMove((items) => moveItemInside(items, 'e', 'a'))}>
          Move E inside A
        </button>
        <button
          onClick={() => runProgrammaticMove((items) => moveItemsBefore(items, ['a', 'b'], 'e'))}
        >
          Move A + B before E
        </button>
        <button
          onClick={() => runProgrammaticMove((items) => moveItemsAfter(items, ['a', 'b'], 'c'))}
        >
          Move A + B after C
        </button>
        <button
          onClick={() => runProgrammaticMove((items) => moveItemsInside(items, ['a', 'b'], 'c'))}
        >
          Move A + B inside C
        </button>
        <button
          onClick={() =>
            runProgrammaticMove((items) =>
              moveItemsInside(items, ['a', 'z'], 'c', {
                overlapBehavior: 'extract-selected-descendants',
              }),
            )
          }
        >
          Extract A + Z inside C
        </button>
        <button onClick={() => runProgrammaticRemove((items) => removeItemById(items, 'b'))}>
          Remove B
        </button>
        <button
          onClick={() => runProgrammaticRemove((items) => removeItemsById(items, ['a', 'z']))}
        >
          Remove A + Z
        </button>
        <button
          onClick={() =>
            setTreeItems((items) =>
              setTreeItemProperties(items, 'a', (item) => ({ collapsed: !item.collapsed })),
            )
          }
        >
          Toggle A collapse
        </button>
        <button
          onClick={() => {
            setTreeItems(BASE_TREE);
            setLastMoveResult(null);
            setDragDisabled(false);
          }}
        >
          Reset tree
        </button>
        <button
          onClick={() =>
            setTreeItems((items) =>
              setTreeItemProperties(items, 'c', (item) => ({
                disableDragging: !item.disableDragging,
              })),
            )
          }
        >
          Toggle C drag disabled
        </button>
        <button
          onClick={() => setUseDragActivationConstraints((isEnabled) => !isEnabled)}
          aria-pressed={useDragActivationConstraints}
        >
          Toggle drag activation constraints
        </button>
        <button
          onClick={() => setDragDisabled((isDisabled) => !isDisabled)}
          aria-pressed={dragDisabled}
        >
          Toggle drag disabled
        </button>
      </div>

      <pre style={{ margin: 0, padding: 12, border: '1px solid #ddd' }}>
        {lastMoveResult
          ? JSON.stringify(lastMoveResult, null, 2)
          : 'Move result will appear here (programmatic or drag-and-drop).'}
      </pre>

      <SortableTree<CustomTreeItem>
        dragDisabled={dragDisabled}
        isCollapsible
        showDropIndicator
        autoExpandOnHoverDelay={600}
        dragActivationConstraints={
          useDragActivationConstraints ? DEMO_DRAG_ACTIVATION_CONSTRAINTS : undefined
        }
        items={treeItems}
        setItems={setTreeItems}
        renderItem={MyCustomTreeItem}
        onDragEnd={(result) => {
          setLastMoveResult(result);
          console.log(result);
        }}
      />
    </div>
  );
};

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error('Root element not found');
}
