this.addEventListener("push", async function (event) {
  const message = await event.data.json();
  let { title, description, image } = message;
  console.log({ message });
  await event.waitUntil(
    this.registration.showNotification(title, {
      actions: [
        {
          action: "archive",
          title: "Archive",
        },
      ],
      body: description,
      icon: image,
    })
  );
});
