import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { sentences } from 'sbd';

export default function Home() {
	const {register, handleSubmit} = useForm();
	const [wiki, setWiki] = useState();

	async function onSubmit(data) {
		const req = await fetch(`https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&explaintext&exsectionformat=plain&format=json&titles=${data.info}`);
		const res = await req.json()
		let content = "";
		for (let i in res.query.pages) {
			content += res.query.pages[i].extract.replace(/(\s\(.*?\))|<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "").replace(/(\r\n|\n|\r)/gm, "");
		}
		content = sentences(content);
		const watsonreq = await fetch("/api/watson", {
			method: "POST",
			body: JSON.stringify({content: content})
		});
	}

	return (
		<div className={styles.background}>
			<main className={styles.container}>
				<h1>Olá, seja bem vindo ao VideoMaker!</h1>
				<p>
					Uma interface gráfica para o aplicativo desenvolvido por <Link target="__blank" href="https://github.com/filipedeschamps" className={styles.link}>Felipe Deschamps</Link>
				</p>
				

				<hr />

				<h2>Para começar a usar, digite um tema e escolha um prefixo.</h2>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
					<div>
						<input type="text" {...register("info")}/>
						<select {...register("prefix")}>
							<option disabled selected>Selecione o prefixo</option>
							<option value="who">Quem é</option>
							<option value="what">O que é</option>
							<option value="history">História</option>
						</select>
					</div>
					<input type="submit" value="Gerar Vídeo"/>
				</form>
				{JSON.stringify(wiki)}
			</main>
		</div>
	)
}
