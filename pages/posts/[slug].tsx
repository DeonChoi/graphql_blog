import styles from "../../styles/Slug.module.css";
import { GraphQLClient, gql } from "graphql-request";

const graphcms = new GraphQLClient(
	"https://api-us-east-1.hygraph.com/v2/clayq3gkr1d2k01uha1dh10ke/master"
);

const QUERY = gql`
	query Post($slug: String!) {
		post(where: { slug: $slug }) {
			id
			title
			slug
			datePublished
			author {
				id
				name
				avatar {
					url
				}
			}
			content {
				html
			}
			coverPhoto {
				id
				url
			}
		}
	}
`;

const SLUGLIST = gql`
	{
		posts {
			slug
		}
	}
`;

export const getStaticPaths = async () => {
	const { posts } = await graphcms.request(SLUGLIST);
	return {
		paths: posts.map((post: any) => ({ params: { slug: post.slug } })),
		fallback: false,
	};
};

export const getStaticProps = async ({ params }: any) => {
	const slug = params.slug;
	const data = await graphcms.request(QUERY, { slug });
	const post = data.post;
	return {
		props: {
			post,
		},
		revalidate: 10,
	};
};

export const Article = ({ post }: any) => {
	return (
		<main className={styles.blog}>
			<img src={post.coverPhoto.url} className={styles.cover} alt="" />
			<div className={styles.title}>
				<img width="75px" height="75px" src={post.author.avatar.url} alt="" />
				<div className={styles.authtext}>
					<h6>By {post.author.name}</h6>
					<h6 className={styles.date}>By {post.datePublished}</h6>
				</div>
			</div>
			<h2>{post.title}</h2>
			<div
				className={styles.content}
				dangerouslySetInnerHTML={{ __html: post.content.html }}></div>
		</main>
	);
};

export default Article;
