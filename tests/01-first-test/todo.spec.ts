import { test, expect, type Page } from '@playwright/test';

// 1. A type for our test data
interface TodoItem {
  title: string;
  done: boolean;
}

// 2. Typed test data: a wrong key or wrong type is a compile error
const todos: TodoItem[] = [
  { title: 'Buy groceries', done: false },
  { title: 'Pay electricity bill', done: true },
  { title: 'Book train ticket', done: false },
];

const TODO_URL = 'https://demo.playwright.dev/todomvc/#/';

// 3. A typed helper: takes a Page and a TodoItem, returns Promise<void>
async function addTodo(page: Page, item: TodoItem): Promise<void> {
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill(item.title);
  await input.press('Enter');
}

test.describe('Todo app – first typed tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TODO_URL);
  });

  test('page has the right title', async ({ page }) => {
    await expect(page).toHaveTitle(/TodoMVC/);
  });

  test('user can add todos and see the count', async ({ page }) => {
    for (const item of todos) {
      await addTodo(page, item);
    }
    await expect(page.getByTestId('todo-title')).toHaveText(
      todos.map((t) => t.title),
    );
    await expect(page.getByTestId('todo-count')).toHaveText('3 items left');
  });

  test('user can complete a todo', async ({ page }) => {
    for (const item of todos) {
      await addTodo(page, item);
    }
    for (const item of todos.filter((t) => t.done)) {
      await page
        .getByTestId('todo-item')
        .filter({ hasText: item.title })
        .getByRole('checkbox')
        .check();
    }
    const remaining: number = todos.filter((t) => !t.done).length;
    await expect(page.getByTestId('todo-count')).toHaveText(
      `${remaining} items left`,
    );
  });
});