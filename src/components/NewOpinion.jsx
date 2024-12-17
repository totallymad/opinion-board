import { use } from "react";
import { useActionState } from "react";
import { OpinionsContext } from "../store/opinions-context";
import Submit from "./Submit";

export function NewOpinion() {
  const { addOpinion } = use(OpinionsContext);

  async function sharedOpinionAction(prevFormState, formData) {
    const userName = formData.get("userName");
    const title = formData.get("title");
    const body = formData.get("body");

    let errors = [];
    if (!userName.trim()) errors.push("Введите свой никнейм");
    if (title.trim() < 3)
      errors.push("Название должно содержать хотя бы 3 символа");
    if (body.trim() < 10 || body.trim() > 300)
      errors.push(
        "Мнение должно быть не больше 300 символов, но и не меньше 10"
      );

    if (errors.length > 0) {
      return {
        errors,
        enteredValues: {
          userName,
          title,
          body,
        },
      };
    }

    // отправка на бэкэнд
    await addOpinion({ title, body, userName });

    return { errors: null };
  }

  const [formState, formAction] = useActionState(sharedOpinionAction, {
    errors: null,
  });

  return (
    <div id="new-opinion">
      <h2>Поделитесь своим мнением!</h2>
      <form action={formAction}>
        <div className="control-row">
          <p className="control">
            <label htmlFor="userName">Ваше имя</label>
            <input
              type="text"
              id="userName"
              name="userName"
              defaultValue={formState.enteredValues?.userName}
            />
          </p>

          <p className="control">
            <label htmlFor="title">Название</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={formState.enteredValues?.title}
            />
          </p>
        </div>
        <p className="control">
          <label htmlFor="body">Ваше мнение</label>
          <textarea
            id="body"
            name="body"
            rows={5}
            defaultValue={formState.enteredValues?.body}
          ></textarea>
        </p>

        <Submit />

        {formState.errors && (
          <ul className="errors">
            {formState.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}
