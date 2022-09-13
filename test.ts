async function performSomeWorkAsync(x: number, y: number): Promise<void> {
  await (x + y);
}

performSomeWorkAsync(2, 4).then().catch();
