import { ContentContainer, ContentHeader, ContentPane } from "@components/app";
import { Badge } from "@components/ui/badge";
import { prisma } from "@lib/prisma";
import { redirect } from "react-router";
import type { Route } from "./+types/recipes.$handle.$slug";

export async function loader({ request, params }: Route.LoaderArgs) {
	const user = await prisma.user.findUnique({
		where: { handle: params.handle },
	});

	if (!user) {
		throw redirect("/");
	}

	const recipe = await prisma.recipe.findUnique({
		where: { userId_slug: { userId: user.id, slug: params.slug } },
		include: {
			sections: {
				orderBy: { index: "asc" },
				include: {
					instructions: { orderBy: { index: "asc" } },
					ingredients: { orderBy: { index: "asc" } },
				}
			}
		}
	});

	if (!recipe) {
		throw redirect("/");
	}

	return { recipe };
}

export default function RecipePage({ loaderData }: Route.ComponentProps) {
	const { recipe } = loaderData;

	return (
		<ContentContainer>
			<ContentHeader>
				<h2 className="recipe__title">{recipe.name}</h2>
				<p className="recipe__description">{recipe.description}</p>
				<div className="recipe__tags">
					{recipe.tags.map((tag, i) => (
						<Badge key={tag}>{tag}</Badge>
					))}
				</div>
			</ContentHeader>
			{recipe.intro && <ContentPane>{recipe.intro}</ContentPane>}
			{recipe.sections.map((section) => (
				<ContentPane key={section.id}>
					<div className="section__header">
						<h3 className="section__title">{section.name}</h3>
						<p className="section__description">{section.description}</p>
					</div>
					<div className="section__body">
						<div className="ingredients">
							<h4 className="subsection__title">Ingredients</h4>
							<div>
								{
									section.ingredients.map((ingredient) =>
										<div key={ingredient.id} className="ingredient">
											<span>{ ingredient.amount }</span>
											<span>{ ingredient.units }</span>
											<span>{ ingredient.name }</span>
											<span>{ ingredient.description }</span>
										</div>
									)
								}
							</div>
						</div>
						<div className="instructions">
							<h4 className="subsection__title">Instructions</h4>
							<div>
								{
									section.instructions.map((instruction, i) => 
										<div key={instruction.id} className="instruction">
											<span>{i}.</span>
											<span>{ instruction.description }</span>
										</div>
									)
								}
							</div>
						</div>
					</div>
				</ContentPane>
			))}
		</ContentContainer>
	);
}
