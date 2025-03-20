import { RenderItemFormSidebarPanelCtx, Field } from "datocms-plugin-sdk";
import { Canvas, ContextInspector } from "datocms-react-ui";

type PropTypes = {
    ctx: RenderItemFormSidebarPanelCtx;
};

export default function SidebarLinks({ ctx }: PropTypes) {
    const modelFields = ctx.itemType.relationships.fields.data
        .map((link) => ctx.fields[link.id])
        .filter<Field>((x): x is Field => !!x);

    const textFields = modelFields.filter((field) =>
        ['text', 'string'].includes(field.attributes.field_type),
    );

    console.log(textFields)

    return (
        <Canvas ctx={ctx}>
            <ContextInspector />
        </Canvas>
    );
}