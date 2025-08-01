"""Remove unique constraint on Tag.name

Revision ID: 84c5f2d5f2de
Revises: d301209ccb14
Create Date: 2025-07-08 00:59:46.410022

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '84c5f2d5f2de'
down_revision: Union[str, None] = 'd301209ccb14'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    # op.drop_constraint('uq_tags_name', 'tags', type_='unique')
    with op.batch_alter_table('tags', schema=None) as batch_op:
        batch_op.drop_constraint('uq_tags_name', type_='unique')
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    # op.create_unique_constraint('uq_tags_name', 'tags', ['name'])
    with op.batch_alter_table('tags', schema=None) as batch_op:
        batch_op.create_unique_constraint('uq_tags_name', ['name'])
    # ### end Alembic commands ###
