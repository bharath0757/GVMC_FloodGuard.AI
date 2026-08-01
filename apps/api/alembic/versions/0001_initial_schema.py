"""initial_schema

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-07-31

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '0001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Enable PostGIS Extension
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis;")

    # 2. Users Table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('role', sa.String(50), nullable=False, server_default='citizen'),
        sa.Column('language_pref', sa.String(10), nullable=False, server_default='en'),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
    )
    op.create_index('ix_users_email', 'users', ['email'])
    op.create_index('ix_users_role', 'users', ['role'])

    # 3. Shelters Table
    op.create_table(
        'shelters',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('ward_name', sa.String(100), nullable=False),
        sa.Column('address', sa.String(500), nullable=False),
        sa.Column('capacity', sa.Integer(), nullable=False),
        sa.Column('current_occupancy', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('contact_phone', sa.String(50), nullable=False),
        sa.Column('is_accessible', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('amenities', sa.JSON(), nullable=True),
        sa.Column('status', sa.String(50), nullable=False, server_default='Open'),
        sa.Column('lat', sa.Float(), nullable=False),
        sa.Column('lng', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
    )
    op.create_index('ix_shelters_name', 'shelters', ['name'])
    op.create_index('ix_shelters_ward_name', 'shelters', ['ward_name'])

    # 4. Flood Reports Table
    op.create_table(
        'flood_reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('reporter_name', sa.String(255), nullable=False),
        sa.Column('ward_name', sa.String(100), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.String(1000), nullable=False),
        sa.Column('severity', sa.String(50), nullable=False, server_default='Medium'),
        sa.Column('status', sa.String(50), nullable=False, server_default='Pending'),
        sa.Column('water_depth_cm', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('lat', sa.Float(), nullable=False),
        sa.Column('lng', sa.Float(), nullable=False),
        sa.Column('image_url', sa.String(500), nullable=True),
        sa.Column('ai_labels', sa.JSON(), nullable=True),
        sa.Column('ai_confidence', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('upvotes', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
    )

    # 5. Alerts Table
    op.create_table(
        'alerts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('severity', sa.String(50), nullable=False, server_default='Warning'),
        sa.Column('affected_wards', sa.JSON(), nullable=False),
        sa.Column('message', sa.String(1000), nullable=False),
        sa.Column('issued_by', sa.String(255), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
    )

    # 6. Weather Snapshots Table
    op.create_table(
        'weather_snapshots',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('temperature_c', sa.Float(), nullable=False),
        sa.Column('humidity_percent', sa.Float(), nullable=False),
        sa.Column('rainfall_mm_hr', sa.Float(), nullable=False),
        sa.Column('rainfall_cumulative_24h', sa.Float(), nullable=False),
        sa.Column('wind_speed_kmh', sa.Float(), nullable=False),
        sa.Column('wind_direction', sa.String(50), nullable=False),
        sa.Column('tide_level_m', sa.Float(), nullable=False),
        sa.Column('sea_level_trend', sa.String(100), nullable=False),
        sa.Column('forecast_summary', sa.String(500), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
    )

    # 7. Risk Zones Table
    op.create_table(
        'risk_zones',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('ward_number', sa.Integer(), nullable=False, unique=True),
        sa.Column('ward_name', sa.String(255), nullable=False),
        sa.Column('risk_score', sa.Integer(), nullable=False),
        sa.Column('risk_category', sa.String(50), nullable=False),
        sa.Column('population', sa.Integer(), nullable=False),
        sa.Column('elevation_meters', sa.Float(), nullable=False),
        sa.Column('water_level_cm', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('rainfall_mm_hr', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('active_alerts_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
    )

    # 8. Audit Logs Table
    op.create_table(
        'audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('action', sa.String(255), nullable=False),
        sa.Column('resource_type', sa.String(100), nullable=False),
        sa.Column('resource_id', sa.String(255), nullable=True),
        sa.Column('details', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
    )

def downgrade() -> None:
    op.drop_table('audit_logs')
    op.drop_table('risk_zones')
    op.drop_table('weather_snapshots')
    op.drop_table('alerts')
    op.drop_table('flood_reports')
    op.drop_table('shelters')
    op.drop_table('users')
