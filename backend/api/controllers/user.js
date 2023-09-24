import { db } from "../db.js";

export const getLogin = (req, res) => {
  const q = "SELECT * FROM user WHERE u_email = ? AND u_senha = ?";
  const { email, password } = req.body;
  const token = Math.random().toString(36).substring(2)

  db.query(q, [email, password], (err, data) => {
    if (err) {
      return null;
    }
    try {
      if (data.length == 0) {
        return res.status(400).json({ error: "Erro ao processar os dados do usuário." });
      }
      const user = data[0].id_user
      return res.status(200).json([{ email: user, token: token }]);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao processar os dados do usuário." });
    }
  });
};

export const getUser = (req, res) => {
  const { email } = req.body;
  const q = `SELECT * from user
              WHERE u_email = ?`;

  db.query(q, [email], async (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro na consulta do banco de dados." });
    }
    try {
      if (data && data.length > 0) {
        return res.status(200).json(data[0]); // Return the first user data
      } else {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }
    } catch (error) {
      return res.status(500).json({ error: "Erro ao processar os dados do usuário." });
    }
  });
};

export const getPost = (req, res) => {
  const { id } = req.body;
  const q = `SELECT p.id_post, u.u_foto, u.u_name, u.u_user, p.content, ip.number_comment, ip.number_reply, ip.number_likes
              FROM post p
              JOIN user u ON p.id_user = u.id_user
              JOIN info_post ip ON p.id_post = ip.id_post
              WHERE p.id_post = ?`

  db.query(q, [id], async (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data)
  })
}

export const getAnswers = (req, res) => {
  const { id } = req.body;
  const q = `SELECT a.id_post, u.u_foto, u.u_name, u.u_user, u.u_email, a.content, ia.number_likes, a.id_answers
              FROM answers a
              JOIN user u ON a.id_user = u.id_user
              JOIN info_answers ia ON a.id_answers = ia.id_answers
              WHERE a.id_post = ?`

  db.query(q, [id], async (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data)
  })
}

export const getPosts = (_, res) => {
  const q = `SELECT p.id_post, u.u_foto, u.u_name, u.u_status, u.u_user, u.u_email, p.content, ip.number_comment, ip.number_reply, ip.number_likes
              FROM post p
              JOIN user u ON p.id_user = u.id_user
              JOIN info_post ip ON p.id_post = ip.id_post`

  db.query(q, (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data)
  })
}

export const getChats = (req, res) => {
  const { id_user } = req.body;
  const q = `SELECT c.id_chat,
              u2.id_user AS id_user_receiver,
              u2.u_name AS Nome,
              u2.u_foto AS Foto,
              c.mensagem AS Mensagem
            FROM
              chat c
            INNER JOIN
                user u2 ON c.id_user_receiver = u2.id_user
              WHERE
                c.id_user_sender = ?
                AND c.data_envio = (
                    SELECT MAX(data_envio) FROM chat
                    WHERE id_user_sender = ? AND id_user_receiver = c.id_user_receiver
                )
                group by c.id_user_receiver
              ORDER BY
                c.data_envio DESC;`

  db.query(q, [id_user, id_user], (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data)
  })
}

export const getMessage = (req, res) => {
  const { id_user_sender, id_user_receiver } = req.body;
  const q = `SELECT c.id_chat,
              u1.id_user AS id_user_sender,
              u1.u_name AS NomeSender,
              u1.u_foto AS FotoSender,
              u2.id_user AS id_user_receiver,
              u2.u_name AS NomeReceiver,
              u2.u_foto AS FotoReceiver,
              c.mensagem AS Mensagem,
              c.data_envio
            FROM
              chat c
            INNER JOIN
                user u1 ON c.id_user_sender = u1.id_user
            INNER JOIN
                user u2 ON c.id_user_receiver = u2.id_user
              WHERE
                (c.id_user_sender = ? AND c.id_user_receiver = ?)
                OR (c.id_user_sender = ? AND c.id_user_receiver = ?)
              ORDER BY
                c.data_envio asc;`;

  db.query(q, [id_user_sender, id_user_receiver, id_user_receiver, id_user_sender], (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data);
  });
};

export const SetNewPost = (req, res) => {
  const q = "INSERT INTO post (id_user, content) VALUES (?,?)"
  const values = [
    req.body.id_user,
    req.body.content,
  ];

  db.query(q, values, (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro na consulta do banco de dados." });
    }
    return res.status(200).json("Sucesso ao cadastrar!");
  });
}

export const SetNewMessage = (req, res) => {
  const q = "INSERT INTO chat (id_user_sender, id_user_receiver, mensagem, data_envio) VALUES (?, ?, ?, ?)"
  
  const values = [
    req.body.id_chat,
    req.body.id_user_friend,
    req.body.content,
    req.body.data_message,
  ];

  db.query(q, values, (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro na consulta do banco de dados." });
    }
    return res.status(200).json("Sucesso ao cadastrar!");
  });
}

export const SetNewAnswers = (req, res) => {
  const q = "INSERT INTO answers (content, id_user, id_post) VALUES (?,?,?)"
  const values = [
    req.body.content,
    req.body.id_user,
    req.body.id_post,
  ];

  db.query(q, values, (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro na consulta do banco de dados." });
    }
    return res.status(200).json("Sucesso ao cadastrar!");
  });
}

export const deletePost = (req, res) => {
  const id_post = req.params.id;

  const q = `DELETE FROM post WHERE id_post = ?;`;

  db.query(q, [id_post], (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro na consulta do banco de dados." });
    }
    return res.status(200).json("Sucesso ao excluir!");
  });
};
